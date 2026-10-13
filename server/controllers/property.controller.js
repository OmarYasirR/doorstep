const Property = require('../models/Property');

const parseMaybeJSON = (v) => (typeof v === 'string' ? JSON.parse(v) : v);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/properties
exports.getProperties = async (req, res) => {
  try {
    const {
      city, minPrice, maxPrice, beds, baths, propertyType, listingType,
      amenities, status, lat, lng, radius, featured,
      page = 1, limit = 12, sort = '-createdAt', search,
    } = req.query;

    const query = {};

    if (city) query['location.city'] = new RegExp(escapeRegex(city), 'i');
    query.status = status ? status : { $in: ['available', 'pending'] };
    if (featured === 'true') query.featured = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (beds) query['specs.beds'] = { $gte: Number(beds) };
    if (baths) query['specs.baths'] = { $gte: Number(baths) };
    if (propertyType) query.propertyType = propertyType;
    if (listingType) query.listingType = listingType;

    if (amenities) {
      const list = amenities.split(',').filter(Boolean);
      if (list.length) query.amenities = { $all: list };
    }

    if (search) query.$text = { $search: search };

    if (lat && lng) {
      query['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [[Number(lng), Number(lat)], (Number(radius) || 5000) / 6378100],
        },
      };
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit) || 12, 50);

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('agent', 'username avatar rating phone')
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Property.countDocuments(query),
    ]);

    res.json({ properties, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('agent', 'username avatar rating reviewCount phone bio agencyName');

    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const images = (req.files || []).map((f, i) => ({ url: f.path, publicId: f.filename, isPrimary: i === 0 }));

    const property = await Property.create({
      ...req.body,
      specs: parseMaybeJSON(req.body.specs),
      location: parseMaybeJSON(req.body.location),
      amenities: req.body.amenities ? parseMaybeJSON(req.body.amenities) : [],
      images: images.length ? images : req.body.images || [],
      agent: req.user.role === 'admin' && req.body.agent ? req.body.agent : req.user._id,
      createdBy: req.user._id,
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (req.user.role !== 'admin' && property.agent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }

    const updates = { ...req.body };
    delete updates.agent;
    delete updates.createdBy;
    ['specs', 'location', 'amenities'].forEach((k) => {
      if (updates[k] !== undefined) updates[k] = parseMaybeJSON(updates[k]);
    });

    if (req.files?.length) {
      const added = req.files.map((f) => ({ url: f.path, publicId: f.filename, isPrimary: false }));
      updates.images = [...property.images, ...added];
    }

    Object.assign(property, updates);
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (req.user.role !== 'admin' && property.agent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }
    await property.deleteOne();
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPropertiesByAgent = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.params.agentId }).sort('-createdAt');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

exports.createInquiry = async (req, res) => {
  try {
    const { propertyId, type, message, requestedDate, requestedTimeSlot, contactInfo } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (type === 'viewing_request') {
      if (!requestedDate || !requestedTimeSlot) {
        return res.status(400).json({ message: 'Choose a date and time slot for the viewing' });
      }
      const conflict = await Inquiry.findOne({
        property: propertyId,
        requestedDate,
        requestedTimeSlot,
        status: { $in: ['pending', 'confirmed'] },
      });
      if (conflict) return res.status(409).json({ message: 'That time slot is already requested' });
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      agent: property.agent,
      user: req.user._id,
      type: type || 'message',
      message,
      requestedDate,
      requestedTimeSlot,
      contactInfo,
    });

    // Hook point: emit socket event / send email notification to the agent here
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create inquiry', error: err.message });
  }
};

exports.getMyInquiries = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { agent: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const inquiries = await Inquiry.find(filter)
      .populate('property', 'title images location.address price')
      .populate('user', 'username email phone avatar')
      .sort('-createdAt');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMySentInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id })
      .populate('property', 'title images location.address price')
      .sort('-createdAt');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'declined', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    if (req.user.role !== 'admin' && inquiry.agent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    inquiry.status = status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

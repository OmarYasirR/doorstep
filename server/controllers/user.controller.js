const User = require('../models/User');
const Property = require('../models/Property');

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-favorites -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this profile' });
    }
    const updates = { ...req.body };
    ['password', 'role', 'email', 'rating', 'reviewCount', 'isActive', 'favorites'].forEach((f) => delete updates[f]);
    if (req.file) updates.avatar = { url: req.file.path, publicId: req.file.filename };

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const user = await User.findById(req.user._id);
    const idx = user.favorites.findIndex((f) => f.toString() === propertyId);
    if (idx > -1) user.favorites.splice(idx, 1);
    else user.favorites.push(propertyId);

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(400).json({ message: 'Could not update favorites', error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

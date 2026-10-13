const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

exports.getStats = async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const [totalListings, activeUsers, totalInquiries, soldCount, newListings, trends, regionalActivity] =
      await Promise.all([
        Property.countDocuments(),
        User.countDocuments({ isActive: true }),
        Inquiry.countDocuments(),
        Property.countDocuments({ status: { $in: ['sold', 'rented'] } }),
        Property.countDocuments({ createdAt: { $gte: weekAgo } }),
        Property.aggregate([
          { $match: { createdAt: { $gte: sixMonthsAgo } } },
          { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),
        Property.aggregate([
          { $group: { _id: '$location.city', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 6 },
        ]),
      ]);

    res.json({ totalListings, activeUsers, totalInquiries, soldCount, newListings, trends, regionalActivity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip((Number(page) - 1) * Number(limit)).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const [listings, total] = await Promise.all([
      Property.find(filter).populate('agent', 'username').sort('-createdAt')
        .skip((Number(page) - 1) * Number(limit)).limit(Number(limit)),
      Property.countDocuments(filter),
    ]);
    res.json({ listings, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'agent', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

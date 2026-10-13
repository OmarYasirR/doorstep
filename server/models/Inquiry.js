const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['message', 'viewing_request'], default: 'message' },
    message: { type: String, trim: true },
    requestedDate: { type: Date },
    requestedTimeSlot: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    contactInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

inquirySchema.index({ agent: 1, status: 1 });
inquirySchema.index({ property: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);

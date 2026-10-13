const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    listingType: { type: String, enum: ['rent', 'sale'], required: true },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'condo', 'villa', 'land', 'commercial'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'sold', 'rented'],
      default: 'available',
      index: true,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true },
      zip: { type: String },
      country: { type: String, default: 'USA' },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }, // [lng, lat]
      },
    },
    specs: {
      beds: { type: Number, required: true },
      baths: { type: Number, required: true },
      sqft: { type: Number, required: true },
      yearBuilt: { type: Number },
      lotSize: { type: Number },
    },
    amenities: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    virtualTourUrl: { type: String, default: '' },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text' });
propertySchema.index({ price: 1, propertyType: 1, listingType: 1, status: 1 });

module.exports = mongoose.model('Property', propertySchema);

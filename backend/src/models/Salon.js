const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  durationMinutes: { type: Number, required: true, default: 30, min: 5 },
  category: { type: String, default: 'General' }, // e.g. Hair, Beard, Spa, Color
  description: { type: String, default: '' },
});

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  photo: { type: String, default: '' },
  specialty: { type: String, default: 'Master Stylist' },
  isActive: { type: Boolean, default: true },
});

const hairstyleGallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  styleName: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['men', 'women', 'kids', 'beard', 'other'],
    default: 'other',
  },
  uploadedAt: { type: Date, default: Date.now },
});

const salonSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Salon name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Premium Grooming & Style Studio',
    },
    description: {
      type: String,
      default: '',
    },
    services: [serviceSchema],
    photos: [{ type: String }],
    coverImage: { type: String, default: '' },
    hairstyleGallery: [hairstyleGallerySchema],
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: 'San Francisco' },
      state: { type: String, default: 'CA' },
      pincode: { type: String, default: '' },
      formattedAddress: { type: String, default: '' },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [-122.4194, 37.7749],
      },
    },
    openingHours: {
      mon: { open: { type: String, default: '09:00' }, close: { type: String, default: '20:00' }, isOpen: { type: Boolean, default: true } },
      tue: { open: { type: String, default: '09:00' }, close: { type: String, default: '20:00' }, isOpen: { type: Boolean, default: true } },
      wed: { open: { type: String, default: '09:00' }, close: { type: String, default: '20:00' }, isOpen: { type: Boolean, default: true } },
      thu: { open: { type: String, default: '09:00' }, close: { type: String, default: '20:00' }, isOpen: { type: Boolean, default: true } },
      fri: { open: { type: String, default: '09:00' }, close: { type: String, default: '20:00' }, isOpen: { type: Boolean, default: true } },
      sat: { open: { type: String, default: '09:00' }, close: { type: String, default: '21:00' }, isOpen: { type: Boolean, default: true } },
      sun: { open: { type: String, default: '10:00' }, close: { type: String, default: '18:00' }, isOpen: { type: Boolean, default: true } },
    },
    totalSeats: {
      type: Number,
      default: 3,
      min: [1, 'Salon must have at least 1 seat/chair'],
    },
    staff: [staffSchema],
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    phone: { type: String, default: '' },
    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },
    amenities: [{ type: String }], // e.g. ["Free Wi-Fi", "Beverages", "Air Conditioned", "Card Payments"]
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for location queries
salonSchema.index({ location: '2dsphere' });
salonSchema.index({ avgRating: -1 });

module.exports = mongoose.model('Salon', salonSchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    services: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        durationMinutes: { type: Number, required: true, default: 30 },
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // e.g. "14:30"
      required: true,
    },
    endTime: {
      type: String, // e.g. "15:15"
      required: true,
    },
    totalDurationMinutes: {
      type: Number,
      default: 30,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    preferredStaff: {
      type: String,
      default: 'Any available specialist',
    },
    customerNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    hasReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up conflict checks and user lookups
bookingSchema.index({ salon: 1, date: 1, startTime: 1 });
bookingSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);

const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Salon = require('../models/Salon');

// @desc    Add a review for a completed booking & recalculate salon avgRating
// @route   POST /api/reviews
// @access  Private (Customer only)
exports.createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bookingId, rating (1-5), and a review comment',
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Must be customer's booking
    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this booking' });
    }

    // Must be completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review appointments that have been marked as completed by the salon.',
      });
    }

    // Barber cannot review their own salon
    const salon = await Salon.findById(booking.salon);
    if (salon.owner.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Salon owners cannot review their own salon' });
    }

    // Check duplicate review
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this booking' });
    }

    const serviceNames = booking.services.map((s) => s.name);

    const review = await Review.create({
      customer: req.user.id,
      salon: booking.salon,
      booking: bookingId,
      rating: Number(rating),
      comment,
      serviceNames,
    });

    // Mark booking as reviewed
    booking.hasReviewed = true;
    await booking.save();

    // Recompute salon's avgRating & numReviews using MongoDB aggregation
    const stats = await Review.aggregate([
      { $match: { salon: booking.salon } },
      {
        $group: {
          _id: '$salon',
          avgRating: { $avg: '$rating' },
          numReviews: { $sum: 1 },
        },
      },
    ]);

    const avgRating = stats.length > 0 ? parseFloat(stats[0].avgRating.toFixed(1)) : 0;
    const numReviews = stats.length > 0 ? stats[0].numReviews : 0;

    await Salon.findByIdAndUpdate(booking.salon, {
      avgRating,
      numReviews,
    });

    const populatedReview = await Review.findById(review._id).populate('customer', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Thank you! Your verified review has been published.',
      data: populatedReview,
      salonStats: { avgRating, numReviews },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a salon
// @route   GET /api/salons/:id/reviews
// @access  Public
exports.getSalonReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ salon: req.params.id })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

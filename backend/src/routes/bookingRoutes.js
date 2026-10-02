const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getSalonBookings,
  updateBookingStatus,
  cancelBooking,
  rescheduleBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Customer routes
router.post('/', protect, authorize('customer'), createBooking);
router.get('/my', protect, authorize('customer'), getMyBookings);
router.put('/:id/reschedule', protect, authorize('customer'), rescheduleBooking);

// Barber routes
router.get('/salon/:salonId', protect, authorize('barber'), getSalonBookings);
router.put('/:id/status', protect, authorize('barber'), updateBookingStatus);

// Shared cancel (Customer or Barber)
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;

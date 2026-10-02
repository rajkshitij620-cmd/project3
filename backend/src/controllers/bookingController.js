const Booking = require('../models/Booking');
const Salon = require('../models/Salon');
const {
  timeToMinutes,
  minutesToTime,
  isOverlapping,
  getAvailableSlots,
  assignNextFreeSeat,
} = require('../utils/timeSlots');

const DAYS_MAP = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// @desc    Get available time slots for a salon and date (Seat-Capacity Aware)
// @route   GET /api/salons/:id/availability
// @access  Public
exports.getSalonAvailability = async (req, res, next) => {
  try {
    const { date, duration = 30 } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date query parameter (YYYY-MM-DD)',
      });
    }

    const salon = await Salon.findById(req.params.id);
    if (!salon) {
      return res.status(404).json({ success: false, message: 'Salon not found' });
    }

    // Parse date and day of week
    const targetDate = new Date(date + 'T00:00:00');
    const dayOfWeekKey = DAYS_MAP[targetDate.getDay()];

    // Find existing pending & confirmed bookings on that date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      salon: salon._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] },
    });

    const availability = getAvailableSlots({
      openingHours: salon.openingHours,
      dayOfWeekKey,
      totalSeats: salon.totalSeats || 1,
      existingBookings,
      serviceDurationMinutes: parseInt(duration, 10) || 30,
      stepMinutes: 30,
    });

    res.status(200).json({
      success: true,
      salonId: salon._id,
      salonName: salon.name,
      totalSeats: salon.totalSeats,
      date,
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new appointment booking (Atomic Seat Conflict Check)
// @route   POST /api/bookings
// @access  Private (Customer only)
exports.createBooking = async (req, res, next) => {
  try {
    const { salonId, services, date, startTime, preferredStaff, customerNotes } = req.body;

    if (!salonId || !services || !services.length || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide salonId, at least one service, date, and startTime',
      });
    }

    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ success: false, message: 'Salon not found' });
    }

    // Calculate total duration & price
    let totalDurationMinutes = 0;
    let totalPrice = 0;
    const validatedServices = [];

    services.forEach((srv) => {
      const match = salon.services.find((s) => s.name === srv.name || s._id.toString() === srv._id);
      if (match) {
        totalDurationMinutes += match.durationMinutes || 30;
        totalPrice += match.price;
        validatedServices.push({
          name: match.name,
          price: match.price,
          durationMinutes: match.durationMinutes || 30,
        });
      } else {
        totalDurationMinutes += srv.durationMinutes || 30;
        totalPrice += srv.price || 0;
        validatedServices.push(srv);
      }
    });

    // Compute end time
    const startMins = timeToMinutes(startTime);
    const endMins = startMins + totalDurationMinutes;
    const endTime = minutesToTime(endMins);

    // Target date window
    const targetDate = new Date(date + 'T00:00:00');
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Re-check capacity server-side atomically right before saving
    const existingBookings = await Booking.find({
      salon: salonId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] },
    });

    // Filter overlapping bookings
    const overlapping = existingBookings.filter((b) =>
      isOverlapping(startMins, endMins, b.startTime, b.endTime)
    );

    const totalSeats = salon.totalSeats || 1;
    if (overlapping.length >= totalSeats) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is fully booked. Please select another time slot.',
      });
    }

    // Assign free seat
    const freeSeat = assignNextFreeSeat(totalSeats, overlapping);
    if (!freeSeat) {
      return res.status(400).json({
        success: false,
        message: 'No chairs available for this time slot. Please choose another time.',
      });
    }

    const booking = await Booking.create({
      customer: req.user.id,
      salon: salonId,
      services: validatedServices,
      date: targetDate,
      startTime,
      endTime,
      totalDurationMinutes,
      totalPrice,
      seatNumber: freeSeat,
      preferredStaff: preferredStaff || 'Any available specialist',
      customerNotes: customerNotes || '',
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('salon', 'name address phone coverImage totalSeats')
      .populate('customer', 'name email phone');

    res.status(201).json({
      success: true,
      message: `Appointment requested! Assigned Chair #${freeSeat}.`,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's bookings
// @route   GET /api/bookings/my
// @access  Private (Customer)
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('salon', 'name address coverImage phone avgRating')
      .sort({ date: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get barber's salon bookings
// @route   GET /api/bookings/salon/:salonId
// @access  Private (Barber)
exports.getSalonBookings = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.salonId);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });
    if (salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these bookings' });
    }

    const bookings = await Booking.find({ salon: salon._id })
      .populate('customer', 'name email phone avatar')
      .sort({ date: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Barber: confirm, complete, cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private (Barber)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const booking = await Booking.findById(req.params.id).populate('salon');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.salon.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (Customer or Barber)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('salon');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const isCustomer = booking.customer.toString() === req.user.id;
    const isBarber = booking.salon.owner.toString() === req.user.id;

    if (!isCustomer && !isBarber) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Seat capacity is now released.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule booking (Customer)
// @route   PUT /api/bookings/:id/reschedule
// @access  Private (Customer)
exports.rescheduleBooking = async (req, res, next) => {
  try {
    const { date, startTime } = req.body;
    if (!date || !startTime) {
      return res.status(400).json({ success: false, message: 'Please provide new date and startTime' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to reschedule' });
    }

    const salon = await Salon.findById(booking.salon);
    if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });

    const startMins = timeToMinutes(startTime);
    const endMins = startMins + (booking.totalDurationMinutes || 30);
    const endTime = minutesToTime(endMins);

    const targetDate = new Date(date + 'T00:00:00');
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      _id: { $ne: booking._id },
      salon: salon._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] },
    });

    const overlapping = existingBookings.filter((b) =>
      isOverlapping(startMins, endMins, b.startTime, b.endTime)
    );

    const totalSeats = salon.totalSeats || 1;
    if (overlapping.length >= totalSeats) {
      return res.status(400).json({
        success: false,
        message: 'The requested rescheduled slot is fully booked.',
      });
    }

    const freeSeat = assignNextFreeSeat(totalSeats, overlapping);

    booking.date = targetDate;
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.seatNumber = freeSeat || 1;
    booking.status = 'pending'; // Re-request confirmation
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully!',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

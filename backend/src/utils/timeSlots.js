/**
 * Time utility functions for slot generation, overlap detection, and seat management.
 */

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Returns array of time slot strings (e.g. ["09:00", "09:30", ...])
 */
function generateSlots(openTime, closeTime, stepMinutes = 30) {
  const openMins = timeToMinutes(openTime);
  const closeMins = timeToMinutes(closeTime);
  const slots = [];

  for (let m = openMins; m < closeMins; m += stepMinutes) {
    slots.push(minutesToTime(m));
  }
  return slots;
}

/**
 * Checks if interval [startA, endA) overlaps with [startB, endB)
 */
function isOverlapping(startA, endA, startB, endB) {
  const sA = typeof startA === 'string' ? timeToMinutes(startA) : startA;
  const eA = typeof endA === 'string' ? timeToMinutes(endA) : endA;
  const sB = typeof startB === 'string' ? timeToMinutes(startB) : startB;
  const eB = typeof endB === 'string' ? timeToMinutes(endB) : endB;

  return Math.max(sA, sB) < Math.min(eA, eB);
}

/**
 * Computes available slots for a given salon, date, and service duration.
 * Accounts for totalSeats capacity.
 */
function getAvailableSlots({
  openingHours,
  dayOfWeekKey,
  totalSeats = 1,
  existingBookings = [],
  serviceDurationMinutes = 30,
  stepMinutes = 30,
}) {
  const daySchedule = openingHours[dayOfWeekKey];
  if (!daySchedule || daySchedule.isOpen === false) {
    return {
      isOpen: false,
      message: 'Salon is closed on this day',
      slots: [],
    };
  }

  const { open, close } = daySchedule;
  const closeMins = timeToMinutes(close);
  const candidateSlots = generateSlots(open, close, stepMinutes);

  const availableSlots = [];

  for (const startTime of candidateSlots) {
    const startMins = timeToMinutes(startTime);
    const endMins = startMins + serviceDurationMinutes;

    // Do not offer slots that extend past closing time
    if (endMins > closeMins) continue;

    const endTime = minutesToTime(endMins);

    // Find all bookings overlapping with [startTime, endTime)
    const overlapping = existingBookings.filter((b) => {
      if (b.status === 'cancelled') return false;
      return isOverlapping(startMins, endMins, b.startTime, b.endTime);
    });

    const bookedSeats = overlapping.map((b) => b.seatNumber);
    const availableSeatsCount = Math.max(0, totalSeats - overlapping.length);

    if (overlapping.length < totalSeats) {
      // Find all free seat numbers (1..totalSeats)
      const freeSeats = [];
      for (let seat = 1; seat <= totalSeats; seat++) {
        if (!bookedSeats.includes(seat)) {
          freeSeats.push(seat);
        }
      }

      availableSlots.push({
        startTime,
        endTime,
        availableSeatsCount,
        totalSeats,
        assignedCandidateSeat: freeSeats[0] || 1,
      });
    }
  }

  return {
    isOpen: true,
    day: dayOfWeekKey,
    openTime: open,
    closeTime: close,
    totalSeats,
    slots: availableSlots,
  };
}

/**
 * Finds the next free seat number (1..totalSeats) for a new booking
 */
function assignNextFreeSeat(totalSeats, overlappingBookings) {
  const usedSeats = overlappingBookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => b.seatNumber);

  for (let seat = 1; seat <= totalSeats; seat++) {
    if (!usedSeats.includes(seat)) {
      return seat;
    }
  }
  return null; // All seats occupied
}

module.exports = {
  timeToMinutes,
  minutesToTime,
  generateSlots,
  isOverlapping,
  getAvailableSlots,
  assignNextFreeSeat,
};

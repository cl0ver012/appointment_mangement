const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const AvailableSlot = require('../models/AvailableSlot');
const googleCalendar = require('../services/googleCalendar');

/**
 * Simplified API endpoints for LLM/Voice AI Function Calling
 * These endpoints have minimal required parameters for easy LLM integration
 */

// ============================================================================
// 1. Check Available Slots (Single Day)
// ============================================================================
router.post('/check-availability', async (req, res) => {
  try {
    const { date } = req.body;
    
    if (!date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Date is required' 
      });
    }

    const slots = await AvailableSlot.find({
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      },
      isBooked: false
    }).sort({ startTime: 1 });

    const availableTimes = slots.map(slot => ({
      time: `${slot.startTime} - ${slot.endTime}`,
      startTime: slot.startTime,
      endTime: slot.endTime
    }));

    res.json({
      success: true,
      date: date,
      availableSlots: availableTimes,
      count: availableTimes.length,
      message: availableTimes.length > 0 
        ? `Found ${availableTimes.length} available slots` 
        : 'No available slots for this date'
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============================================================================
// 1A. Check Available Slots for Date Range (NEW - More Efficient!)
// ============================================================================
router.post('/check-availability-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both startDate and endDate are required' 
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate date range
    if (start > end) {
      return res.status(400).json({ 
        success: false, 
        message: 'startDate must be before or equal to endDate' 
      });
    }

    // Limit range to prevent excessive queries (max 90 days)
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff > 90) {
      return res.status(400).json({ 
        success: false, 
        message: 'Date range cannot exceed 90 days' 
      });
    }

    // Query all available slots in the date range
    const slots = await AvailableSlot.find({
      date: {
        $gte: start,
        $lte: end
      },
      isBooked: false
    }).sort({ date: 1, startTime: 1 });

    // Group slots by date
    const slotsByDate = {};
    slots.forEach(slot => {
      const dateKey = slot.date.toISOString().split('T')[0];
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push({
        time: `${slot.startTime} - ${slot.endTime}`,
        startTime: slot.startTime,
        endTime: slot.endTime
      });
    });

    const totalSlots = slots.length;
    const datesWithSlots = Object.keys(slotsByDate).length;

    res.json({
      success: true,
      startDate: startDate,
      endDate: endDate,
      totalAvailableSlots: totalSlots,
      datesWithAvailability: datesWithSlots,
      slotsByDate: slotsByDate,
      message: totalSlots > 0 
        ? `Found ${totalSlots} available slots across ${datesWithSlots} dates` 
        : 'No available slots in this date range'
    });
  } catch (error) {
    console.error('Error checking availability range:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============================================================================
// 1B. Check Available Slots for Next N Days (NEW - Most Convenient!)
// ============================================================================
router.post('/check-availability-next-days', async (req, res) => {
  try {
    const { days } = req.body;
    
    if (!days) {
      return res.status(400).json({ 
        success: false, 
        message: 'Number of days is required' 
      });
    }

    const numDays = parseInt(days);
    if (isNaN(numDays) || numDays < 1 || numDays > 90) {
      return res.status(400).json({ 
        success: false, 
        message: 'Days must be a number between 1 and 90' 
      });
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Start of today
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + numDays);
    endDate.setHours(23, 59, 59, 999); // End of last day

    // Query all available slots in the date range
    const slots = await AvailableSlot.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      isBooked: false
    }).sort({ date: 1, startTime: 1 });

    // Group slots by date
    const slotsByDate = {};
    slots.forEach(slot => {
      const dateKey = slot.date.toISOString().split('T')[0];
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push({
        time: `${slot.startTime} - ${slot.endTime}`,
        startTime: slot.startTime,
        endTime: slot.endTime
      });
    });

    const totalSlots = slots.length;
    const datesWithSlots = Object.keys(slotsByDate).length;

    res.json({
      success: true,
      searchPeriod: `Next ${numDays} days`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalAvailableSlots: totalSlots,
      datesWithAvailability: datesWithSlots,
      slotsByDate: slotsByDate,
      message: totalSlots > 0 
        ? `Found ${totalSlots} available slots across ${datesWithSlots} dates in the next ${numDays} days` 
        : `No available slots in the next ${numDays} days`
    });
  } catch (error) {
    console.error('Error checking availability for next days:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============================================================================
// 1C. Get Next Available Slot (NEW - Quick Booking)
// ============================================================================
router.post('/get-next-available', async (req, res) => {
  try {
    const { fromDate, limit } = req.body;
    
    // Default to today if no fromDate provided
    const searchFrom = fromDate ? new Date(fromDate) : new Date();
    searchFrom.setHours(0, 0, 0, 0);
    
    // Default limit to 10 slots
    const maxSlots = limit ? parseInt(limit) : 10;

    const slots = await AvailableSlot.find({
      date: { $gte: searchFrom },
      isBooked: false
    })
    .sort({ date: 1, startTime: 1 })
    .limit(maxSlots);

    const availableSlots = slots.map(slot => ({
      date: slot.date.toISOString().split('T')[0],
      time: `${slot.startTime} - ${slot.endTime}`,
      startTime: slot.startTime,
      endTime: slot.endTime
    }));

    res.json({
      success: true,
      nextAvailableSlots: availableSlots,
      count: availableSlots.length,
      message: availableSlots.length > 0 
        ? `Found ${availableSlots.length} upcoming available slots` 
        : 'No available slots found'
    });
  } catch (error) {
    console.error('Error getting next available slots:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============================================================================
// 2. Book Appointment (Minimal Parameters)
// ============================================================================
router.post('/book-appointment', async (req, res) => {
  try {
    const { email, date, time } = req.body;

    if (!email || !date || !time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required: email, date, and time' 
      });
    }

    // Extract note if provided
    const note = req.body.note || '';

    // Find the slot for this time
    const slot = await AvailableSlot.findOne({
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      },
      startTime: time,
      isBooked: false
    });

    if (!slot) {
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot is not available' 
      });
    }

    // Create appointment
    const appointment = new Appointment({
      userEmail: email,
      doctorId: 'doctor1',
      appointmentDate: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      note: note
    });

    await appointment.save();

    // Create Google Calendar event
    const calendarEvent = await googleCalendar.createCalendarEvent(appointment);
    if (calendarEvent) {
      appointment.googleEventId = calendarEvent.eventId;
      appointment.googleEventLink = calendarEvent.eventLink;
      appointment.googleMeetLink = calendarEvent.meetLink;
      await appointment.save();
    }

    // Mark slot as booked
    slot.isBooked = true;
    slot.appointmentId = appointment._id;
    await slot.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment._id,
        email: appointment.userEmail,
        date: appointment.appointmentDate.toISOString().split('T')[0],
        time: `${appointment.startTime} - ${appointment.endTime}`,
        meetLink: appointment.googleMeetLink,
        calendarLink: appointment.googleEventLink
      }
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============================================================================
// 3. Get Patient Appointments
// ============================================================================
router.post('/get-appointments', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const appointments = await Appointment.find({
      userEmail: email.toLowerCase(),
      status: { $ne: 'cancelled' }
    }).sort({ appointmentDate: 1, startTime: 1 });

    const formattedAppointments = appointments.map(apt => ({
      id: apt._id,
      date: apt.appointmentDate.toISOString().split('T')[0],
      time: `${apt.startTime} - ${apt.endTime}`,
      status: apt.status,
      note: apt.note,
      meetLink: apt.googleMeetLink
    }));

    res.json({
      success: true,
      email: email,
      appointments: formattedAppointments,
      count: formattedAppointments.length,
      message: formattedAppointments.length > 0 
        ? `Found ${formattedAppointments.length} appointment(s)` 
        : 'No appointments found'
    });
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============================================================================
// 4. Cancel Appointment
// ============================================================================
router.post('/cancel-appointment', async (req, res) => {
  try {
    const { email, date } = req.body;

    if (!email || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required: email and date' 
      });
    }

    // Find the appointment
    const appointment = await Appointment.findOne({
      userEmail: email.toLowerCase(),
      appointmentDate: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      },
      status: { $ne: 'cancelled' }
    });

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'No appointment found for this email and date' 
      });
    }

    // Cancel appointment
    appointment.status = 'cancelled';
    await appointment.save();

    // Cancel Google Calendar event
    if (appointment.googleEventId) {
      await googleCalendar.cancelCalendarEvent(appointment.googleEventId);
    }

    // Release the slot
    await AvailableSlot.updateOne(
      { appointmentId: appointment._id },
      { isBooked: false, appointmentId: null }
    );

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      cancelled: {
        date: appointment.appointmentDate.toISOString().split('T')[0],
        time: `${appointment.startTime} - ${appointment.endTime}`
      }
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============================================================================
// 5. Reschedule Appointment
// ============================================================================
router.post('/reschedule-appointment', async (req, res) => {
  try {
    const { email, currentDate, newDate, newTime } = req.body;

    if (!email || !currentDate || !newDate || !newTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required: email, currentDate, newDate, and newTime' 
      });
    }

    // Find current appointment
    const appointment = await Appointment.findOne({
      userEmail: email.toLowerCase(),
      appointmentDate: {
        $gte: new Date(currentDate),
        $lt: new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1))
      },
      status: { $ne: 'cancelled' }
    });

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'No appointment found to reschedule' 
      });
    }

    // Find new slot
    const newSlot = await AvailableSlot.findOne({
      date: {
        $gte: new Date(newDate),
        $lt: new Date(new Date(newDate).setDate(new Date(newDate).getDate() + 1))
      },
      startTime: newTime,
      isBooked: false
    });

    if (!newSlot) {
      return res.status(400).json({ 
        success: false, 
        message: 'New time slot is not available' 
      });
    }

    // Release old slot
    await AvailableSlot.updateOne(
      { appointmentId: appointment._id },
      { isBooked: false, appointmentId: null }
    );

    // Update appointment
    const oldDate = appointment.appointmentDate.toISOString().split('T')[0];
    const oldTime = `${appointment.startTime} - ${appointment.endTime}`;
    
    appointment.appointmentDate = newSlot.date;
    appointment.startTime = newSlot.startTime;
    appointment.endTime = newSlot.endTime;
    appointment.status = 'rescheduled';
    await appointment.save();

    // Update Google Calendar
    if (appointment.googleEventId) {
      await googleCalendar.updateCalendarEvent(appointment.googleEventId, appointment);
    }

    // Book new slot
    newSlot.isBooked = true;
    newSlot.appointmentId = appointment._id;
    await newSlot.save();

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      rescheduled: {
        from: { date: oldDate, time: oldTime },
        to: { 
          date: newDate, 
          time: `${newSlot.startTime} - ${newSlot.endTime}`,
          meetLink: appointment.googleMeetLink
        }
      }
    });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;


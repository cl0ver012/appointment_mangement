const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Appointment = require('../models/Appointment');
const AvailableSlot = require('../models/AvailableSlot');
const googleCalendar = require('../services/googleCalendar');

// Get all appointments with optional filters
router.get('/', [
  query('email').optional().isEmail().withMessage('Invalid email format'),
  query('date').optional().isISO8601().withMessage('Invalid date format'),
  query('status').optional().isIn(['scheduled', 'completed', 'cancelled', 'rescheduled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, date, status } = req.query;
    let query = {};

    if (email) query.userEmail = email.toLowerCase();
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query).sort({ appointmentDate: 1, startTime: 1 });
    res.json({ success: true, data: appointments, count: appointments.length });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create a new appointment
router.post('/', [
  body('userEmail').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('appointmentDate').isISO8601().withMessage('Valid date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('note').optional().trim().isLength({ max: 500 }).withMessage('Note must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userEmail, appointmentDate, startTime, endTime, note, doctorId } = req.body;

    // Check if the slot is available
    const appointmentDateObj = new Date(appointmentDate);
    const existingAppointment = await Appointment.findOne({
      doctorId: doctorId || 'doctor1',
      appointmentDate: {
        $gte: new Date(appointmentDateObj.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDateObj.setHours(23, 59, 59, 999))
      },
      startTime: startTime,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot is already booked' 
      });
    }

    // Create the appointment
    const appointment = new Appointment({
      userEmail,
      doctorId: doctorId || 'doctor1',
      appointmentDate,
      startTime,
      endTime,
      note: note || ''
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

    // Update the slot as booked if it exists
    await AvailableSlot.updateOne(
      {
        doctorId: doctorId || 'doctor1',
        date: appointmentDate,
        startTime: startTime,
        isBooked: false
      },
      {
        isBooked: true,
        appointmentId: appointment._id
      }
    );

    res.status(201).json({ 
      success: true, 
      message: 'Appointment created successfully', 
      data: appointment 
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update an appointment
router.put('/:id', [
  body('userEmail').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('appointmentDate').optional().isISO8601().withMessage('Valid date is required'),
  body('startTime').optional().notEmpty().withMessage('Start time cannot be empty'),
  body('endTime').optional().notEmpty().withMessage('End time cannot be empty'),
  body('note').optional().trim().isLength({ max: 500 }).withMessage('Note must be less than 500 characters'),
  body('status').optional().isIn(['scheduled', 'completed', 'cancelled', 'rescheduled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const { userEmail, appointmentDate, startTime, endTime, note, status } = req.body;

    // If rescheduling, check if new slot is available
    if ((appointmentDate || startTime) && status !== 'cancelled') {
      const newDate = appointmentDate || appointment.appointmentDate;
      const newStartTime = startTime || appointment.startTime;
      
      const dateObj = new Date(newDate);
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: appointment._id },
        doctorId: appointment.doctorId,
        appointmentDate: {
          $gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          $lt: new Date(dateObj.setHours(23, 59, 59, 999))
        },
        startTime: newStartTime,
        status: { $ne: 'cancelled' }
      });

      if (conflictingAppointment) {
        return res.status(400).json({ 
          success: false, 
          message: 'The new time slot is already booked' 
        });
      }
    }

    // Release old slot if rescheduling or cancelling
    if ((appointmentDate || startTime || status === 'cancelled') && appointment.status !== 'cancelled') {
      await AvailableSlot.updateOne(
        {
          doctorId: appointment.doctorId,
          date: appointment.appointmentDate,
          startTime: appointment.startTime,
          appointmentId: appointment._id
        },
        {
          isBooked: false,
          appointmentId: null
        }
      );
    }

    // Update appointment fields
    if (userEmail) appointment.userEmail = userEmail;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (startTime) appointment.startTime = startTime;
    if (endTime) appointment.endTime = endTime;
    if (note !== undefined) appointment.note = note;
    if (status) appointment.status = status;

    await appointment.save();

    // Update Google Calendar event
    if (appointment.googleEventId) {
      if (status === 'cancelled') {
        await googleCalendar.cancelCalendarEvent(appointment.googleEventId);
      } else {
        await googleCalendar.updateCalendarEvent(appointment.googleEventId, appointment);
      }
    }

    // Book new slot if rescheduling
    if ((appointmentDate || startTime) && appointment.status !== 'cancelled') {
      await AvailableSlot.updateOne(
        {
          doctorId: appointment.doctorId,
          date: appointment.appointmentDate,
          startTime: appointment.startTime,
          isBooked: false
        },
        {
          isBooked: true,
          appointmentId: appointment._id
        }
      );
    }

    res.json({ 
      success: true, 
      message: 'Appointment updated successfully', 
      data: appointment 
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Delete Google Calendar event
    if (appointment.googleEventId) {
      await googleCalendar.cancelCalendarEvent(appointment.googleEventId);
    }

    // Release the slot
    await AvailableSlot.updateOne(
      {
        doctorId: appointment.doctorId,
        date: appointment.appointmentDate,
        startTime: appointment.startTime,
        appointmentId: appointment._id
      },
      {
        isBooked: false,
        appointmentId: null
      }
    );

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;


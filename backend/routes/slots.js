const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const AvailableSlot = require('../models/AvailableSlot');

// Get available slots with optional date filter
router.get('/', [
  query('date').optional().isISO8601().withMessage('Invalid date format'),
  query('doctorId').optional().isString(),
  query('available').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, doctorId, available } = req.query;
    let query = {};

    if (doctorId) query.doctorId = doctorId;
    if (available === 'true' || available === true) query.isBooked = false;
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    } else {
      // By default, only show future slots
      query.date = { $gte: new Date() };
    }

    const slots = await AvailableSlot.find(query)
      .populate('appointmentId')
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, data: slots, count: slots.length });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create a new available slot
router.post('/', [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('doctorId').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { date, startTime, endTime, doctorId } = req.body;

    // Check if slot already exists
    const existingSlot = await AvailableSlot.findOne({
      doctorId: doctorId || 'doctor1',
      date: date,
      startTime: startTime
    });

    if (existingSlot) {
      return res.status(400).json({ 
        success: false, 
        message: 'A slot with this time already exists' 
      });
    }

    const slot = new AvailableSlot({
      doctorId: doctorId || 'doctor1',
      date,
      startTime,
      endTime
    });

    await slot.save();

    res.status(201).json({ 
      success: true, 
      message: 'Slot created successfully', 
      data: slot 
    });
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Bulk create slots for a date range
router.post('/bulk', [
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('timeSlots').isArray().withMessage('Time slots must be an array'),
  body('timeSlots.*.startTime').notEmpty().withMessage('Start time is required'),
  body('timeSlots.*.endTime').notEmpty().withMessage('End time is required'),
  body('doctorId').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { startDate, endDate, timeSlots, doctorId, excludeWeekends } = req.body;

    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate slots for each day in the range
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      // Skip weekends if requested
      if (excludeWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
        continue;
      }

      for (const timeSlot of timeSlots) {
        // Check if slot already exists
        const existingSlot = await AvailableSlot.findOne({
          doctorId: doctorId || 'doctor1',
          date: new Date(date),
          startTime: timeSlot.startTime
        });

        if (!existingSlot) {
          slots.push({
            doctorId: doctorId || 'doctor1',
            date: new Date(date),
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime
          });
        }
      }
    }

    if (slots.length > 0) {
      await AvailableSlot.insertMany(slots);
    }

    res.status(201).json({ 
      success: true, 
      message: `${slots.length} slots created successfully`, 
      data: { created: slots.length }
    });
  } catch (error) {
    console.error('Error creating bulk slots:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete a slot
router.delete('/:id', async (req, res) => {
  try {
    const slot = await AvailableSlot.findById(req.params.id);
    
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete a booked slot. Cancel the appointment first.' 
      });
    }

    await AvailableSlot.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;


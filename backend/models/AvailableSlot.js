const mongoose = require('mongoose');

const availableSlotSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: true,
    default: 'doctor1'
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
availableSlotSchema.index({ doctorId: 1, date: 1, isBooked: 1 });

module.exports = mongoose.model('AvailableSlot', availableSlotSchema);


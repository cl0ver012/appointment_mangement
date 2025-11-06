/**
 * Sample Data Initialization Script
 * Run this script to populate the database with sample slots
 * 
 * Usage: node init-sample-data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AvailableSlot = require('./models/AvailableSlot');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment_management';

// Sample time slots for each day
const timeSlots = [
  { startTime: '09:00', endTime: '09:30' },
  { startTime: '09:30', endTime: '10:00' },
  { startTime: '10:00', endTime: '10:30' },
  { startTime: '10:30', endTime: '11:00' },
  { startTime: '11:00', endTime: '11:30' },
  { startTime: '11:30', endTime: '12:00' },
  { startTime: '14:00', endTime: '14:30' },
  { startTime: '14:30', endTime: '15:00' },
  { startTime: '15:00', endTime: '15:30' },
  { startTime: '15:30', endTime: '16:00' },
  { startTime: '16:00', endTime: '16:30' },
  { startTime: '16:30', endTime: '17:00' },
];

async function initializeSampleData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Generate slots for the next 14 days (excluding existing slots)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const slots = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }
      
      for (const timeSlot of timeSlots) {
        // Check if slot already exists
        const existingSlot = await AvailableSlot.findOne({
          doctorId: 'doctor1',
          date: date,
          startTime: timeSlot.startTime
        });
        
        if (!existingSlot) {
          slots.push({
            doctorId: 'doctor1',
            date: new Date(date),
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            isBooked: false
          });
        }
      }
    }
    
    if (slots.length > 0) {
      console.log(`Creating ${slots.length} sample slots...`);
      await AvailableSlot.insertMany(slots);
      console.log(`✓ Successfully created ${slots.length} slots`);
    } else {
      console.log('No new slots to create (slots already exist)');
    }
    
    // Display summary
    const totalSlots = await AvailableSlot.countDocuments({});
    const availableSlots = await AvailableSlot.countDocuments({ isBooked: false });
    const bookedSlots = await AvailableSlot.countDocuments({ isBooked: true });
    
    console.log('\n=== Database Summary ===');
    console.log(`Total Slots: ${totalSlots}`);
    console.log(`Available Slots: ${availableSlots}`);
    console.log(`Booked Slots: ${bookedSlots}`);
    console.log('========================\n');
    
    console.log('Sample data initialization complete!');
    
  } catch (error) {
    console.error('Error initializing sample data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the initialization
initializeSampleData();


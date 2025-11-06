/**
 * Demo Data Script
 * Adds realistic demo appointments for dashboard demonstration
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const AvailableSlot = require('./models/AvailableSlot');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment_management';

// Demo patient emails
const demoPatients = [
  'john.smith@email.com',
  'sarah.johnson@email.com',
  'michael.brown@email.com',
  'emily.davis@email.com',
  'david.wilson@email.com',
  'jennifer.taylor@email.com',
  'robert.anderson@email.com',
  'lisa.thomas@email.com'
];

// Demo appointment notes
const demoNotes = [
  'Annual checkup',
  'Follow-up consultation',
  'Flu symptoms',
  'Blood pressure monitoring',
  'Prescription refill',
  'Routine physical exam',
  'Lab results review',
  'Back pain consultation',
  'Allergy consultation',
  'Wellness visit'
];

async function addDemoData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB\n');

    // Get today and next few days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = [];

    // Create appointments for today
    console.log('Creating demo appointments for today...');
    const todaySlots = await AvailableSlot.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      },
      isBooked: false
    }).limit(3);

    for (let i = 0; i < Math.min(3, todaySlots.length); i++) {
      const slot = todaySlots[i];
      const appointment = new Appointment({
        userEmail: demoPatients[i % demoPatients.length],
        doctorId: 'doctor1',
        appointmentDate: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        note: demoNotes[i % demoNotes.length],
        status: 'scheduled'
      });
      
      await appointment.save();
      
      // Mark slot as booked
      slot.isBooked = true;
      slot.appointmentId = appointment._id;
      await slot.save();
      
      appointments.push(appointment);
      console.log(`✓ Created appointment: ${appointment.userEmail} at ${appointment.startTime}`);
    }

    // Create appointments for tomorrow
    console.log('\nCreating demo appointments for tomorrow...');
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tomorrowSlots = await AvailableSlot.find({
      date: {
        $gte: tomorrow,
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
      },
      isBooked: false
    }).limit(2);

    for (let i = 0; i < Math.min(2, tomorrowSlots.length); i++) {
      const slot = tomorrowSlots[i];
      const appointment = new Appointment({
        userEmail: demoPatients[(i + 3) % demoPatients.length],
        doctorId: 'doctor1',
        appointmentDate: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        note: demoNotes[(i + 3) % demoNotes.length],
        status: 'scheduled'
      });
      
      await appointment.save();
      
      // Mark slot as booked
      slot.isBooked = true;
      slot.appointmentId = appointment._id;
      await slot.save();
      
      appointments.push(appointment);
      console.log(`✓ Created appointment: ${appointment.userEmail} at ${appointment.startTime}`);
    }

    // Create some appointments for next week
    console.log('\nCreating demo appointments for next week...');
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const nextWeekSlots = await AvailableSlot.find({
      date: {
        $gte: nextWeek,
        $lt: new Date(nextWeek.getTime() + 24 * 60 * 60 * 1000)
      },
      isBooked: false
    }).limit(3);

    for (let i = 0; i < Math.min(3, nextWeekSlots.length); i++) {
      const slot = nextWeekSlots[i];
      const appointment = new Appointment({
        userEmail: demoPatients[(i + 5) % demoPatients.length],
        doctorId: 'doctor1',
        appointmentDate: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        note: demoNotes[(i + 5) % demoNotes.length],
        status: 'scheduled'
      });
      
      await appointment.save();
      
      // Mark slot as booked
      slot.isBooked = true;
      slot.appointmentId = appointment._id;
      await slot.save();
      
      appointments.push(appointment);
      console.log(`✓ Created appointment: ${appointment.userEmail} at ${appointment.startTime}`);
    }

    // Create one completed appointment from yesterday
    console.log('\nCreating completed appointment from yesterday...');
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const yesterdaySlots = await AvailableSlot.find({
      date: {
        $gte: yesterday,
        $lt: today
      }
    }).limit(1);

    if (yesterdaySlots.length > 0) {
      const slot = yesterdaySlots[0];
      const completedApt = new Appointment({
        userEmail: 'completed.patient@email.com',
        doctorId: 'doctor1',
        appointmentDate: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        note: 'Regular checkup - completed',
        status: 'completed',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      });
      
      await completedApt.save();
      console.log(`✓ Created completed appointment: ${completedApt.userEmail}`);
    }

    // Display summary
    console.log('\n═══════════════════════════════════════');
    console.log('✅ Demo Data Created Successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`Total appointments created: ${appointments.length + 1}`);
    console.log(`Today's appointments: 3`);
    console.log(`Tomorrow's appointments: 2`);
    console.log(`Next week appointments: 3`);
    console.log(`Completed appointments: 1`);
    console.log('═══════════════════════════════════════\n');
    
    // Get updated stats
    const totalAppointments = await Appointment.countDocuments({ status: { $ne: 'cancelled' } });
    const totalSlots = await AvailableSlot.countDocuments({});
    const bookedSlots = await AvailableSlot.countDocuments({ isBooked: true });
    
    console.log('📊 Current Database Statistics:');
    console.log(`Total Appointments: ${totalAppointments}`);
    console.log(`Total Slots: ${totalSlots}`);
    console.log(`Booked Slots: ${bookedSlots}`);
    console.log(`Available Slots: ${totalSlots - bookedSlots}`);
    console.log('\n✨ Your dashboard is now populated with demo data!');
    console.log('🌐 Visit http://localhost:3000 to see it in action!\n');

  } catch (error) {
    console.error('Error adding demo data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
addDemoData();


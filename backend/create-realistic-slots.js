require('dotenv').config();
const mongoose = require('mongoose');
const AvailableSlot = require('./models/AvailableSlot');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Doctor's typical schedule templates (realistic variations)
const scheduleTemplates = [
  // Morning clinic (9:00 - 12:00)
  {
    name: 'Morning Clinic',
    slots: [
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '10:30', endTime: '11:00' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '11:30', endTime: '12:00' }
    ]
  },
  // Afternoon clinic (14:00 - 17:00)
  {
    name: 'Afternoon Clinic',
    slots: [
      { startTime: '14:00', endTime: '14:30' },
      { startTime: '14:30', endTime: '15:00' },
      { startTime: '15:00', endTime: '15:30' },
      { startTime: '15:30', endTime: '16:00' },
      { startTime: '16:00', endTime: '16:30' },
      { startTime: '16:30', endTime: '17:00' }
    ]
  },
  // Full day (9:00-12:00 and 14:00-16:00) - shorter afternoon
  {
    name: 'Full Day',
    slots: [
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '10:30', endTime: '11:00' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '11:30', endTime: '12:00' },
      { startTime: '14:00', endTime: '14:30' },
      { startTime: '14:30', endTime: '15:00' },
      { startTime: '15:00', endTime: '15:30' },
      { startTime: '15:30', endTime: '16:00' }
    ]
  },
  // Short morning (10:00 - 12:00)
  {
    name: 'Short Morning',
    slots: [
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '10:30', endTime: '11:00' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '11:30', endTime: '12:00' }
    ]
  },
  // Short afternoon (15:00 - 17:00)
  {
    name: 'Short Afternoon',
    slots: [
      { startTime: '15:00', endTime: '15:30' },
      { startTime: '15:30', endTime: '16:00' },
      { startTime: '16:00', endTime: '16:30' },
      { startTime: '16:30', endTime: '17:00' }
    ]
  }
];

// Get a realistic schedule for a day (varies by day of week)
const getScheduleForDay = (dayOfWeek) => {
  // Monday, Wednesday, Friday: More likely to have morning clinics
  if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
    const rand = Math.random();
    if (rand < 0.4) return scheduleTemplates[0]; // Morning clinic
    if (rand < 0.7) return scheduleTemplates[2]; // Full day
    return scheduleTemplates[1]; // Afternoon clinic
  }
  
  // Tuesday, Thursday: More variety
  if (dayOfWeek === 2 || dayOfWeek === 4) {
    const rand = Math.random();
    if (rand < 0.3) return scheduleTemplates[1]; // Afternoon clinic
    if (rand < 0.5) return scheduleTemplates[3]; // Short morning
    if (rand < 0.7) return scheduleTemplates[4]; // Short afternoon
    return scheduleTemplates[2]; // Full day
  }
  
  return scheduleTemplates[0]; // Default
};

// Helper function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Main function to create realistic slots
const createRealisticSlots = async () => {
  try {
    console.log('🏥 Creating realistic doctor schedule for next 3 months...\n');
    
    // Clear existing slots
    console.log('📋 Clearing existing slots...');
    await AvailableSlot.deleteMany({});
    console.log('✅ Existing slots cleared\n');
    
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    // 3 months = approximately 90 days
    const endDate = addDays(startDate, 90);
    
    const slotsToCreate = [];
    let totalDays = 0;
    let weekdayCount = 0;
    let totalSlots = 0;
    
    // Generate slots for each day
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate = addDays(currentDate, 1)) {
      totalDays++;
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }
      
      weekdayCount++;
      
      // Get schedule template for this day
      const schedule = getScheduleForDay(dayOfWeek);
      
      // Occasionally (10% chance), doctor might not be available (vacation, conference, etc.)
      if (Math.random() < 0.1) {
        console.log(`  ${formatDate(currentDate)} (${getDayName(dayOfWeek)}): No clinic (day off)`);
        continue;
      }
      
      // Create slots for this day
      for (const timeSlot of schedule.slots) {
        slotsToCreate.push({
          doctorId: 'doctor1',
          date: new Date(currentDate),
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          isBooked: false
        });
        totalSlots++;
      }
      
      console.log(`  ${formatDate(currentDate)} (${getDayName(dayOfWeek)}): ${schedule.name} - ${schedule.slots.length} slots`);
    }
    
    // Insert all slots
    console.log('\n💾 Saving slots to database...');
    await AvailableSlot.insertMany(slotsToCreate);
    
    console.log('\n✅ Realistic schedule created successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Total days: ${totalDays}`);
    console.log(`   Weekdays: ${weekdayCount}`);
    console.log(`   Working days: ${slotsToCreate.length / 6} (approx.)`); // Assuming avg 6 slots per day
    console.log(`   Total available slots: ${totalSlots}`);
    console.log(`   Average slots per working day: ${(totalSlots / weekdayCount).toFixed(1)}`);
    console.log(`   Date range: ${formatDate(startDate)} to ${formatDate(endDate)}`);
    
    // Show some sample days
    console.log('\n📅 Sample schedule for first week:');
    const firstWeekSlots = await AvailableSlot.find({
      date: { $gte: startDate, $lte: addDays(startDate, 7) }
    }).sort({ date: 1, startTime: 1 });
    
    let currentDisplayDate = null;
    firstWeekSlots.forEach(slot => {
      const slotDate = formatDate(slot.date);
      if (slotDate !== currentDisplayDate) {
        currentDisplayDate = slotDate;
        const dayName = getDayName(slot.date.getDay());
        console.log(`\n   ${slotDate} (${dayName}):`);
      }
      console.log(`      ${slot.startTime} - ${slot.endTime}`);
    });
    
    console.log('\n🎉 Done! Your doctor now has a realistic schedule for the next 3 months!');
    console.log('\n💡 Test it with:');
    console.log('   curl -X POST http://localhost:5000/api/llm/check-availability-next-days \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"days": 7}\'');
    
  } catch (error) {
    console.error('❌ Error creating slots:', error);
  }
};

// Helper to get day name
const getDayName = (dayOfWeek) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayOfWeek];
};

// Run the script
const run = async () => {
  await connectDB();
  await createRealisticSlots();
  process.exit(0);
};

run();


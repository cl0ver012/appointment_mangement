require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

async function checkLastBooking() {
  await mongoose.connect(process.env.MONGODB_URI);
  const last = await Appointment.findOne().sort({createdAt: -1}).limit(1);
  console.log(JSON.stringify({
    email: last.userEmail,
    date: last.appointmentDate,
    googleEventId: last.googleEventId,
    googleMeetLink: last.googleMeetLink,
    googleEventLink: last.googleEventLink
  }, null, 2));
  process.exit(0);
}
checkLastBooking();

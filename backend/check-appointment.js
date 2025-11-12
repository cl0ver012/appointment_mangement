require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

async function checkAppointment() {
  await mongoose.connect(process.env.MONGODB_URI);
  const apt = await Appointment.findById('691468dde1ef7ab34d9a8344');
  if (apt) {
    console.log('First successful booking:');
    console.log(JSON.stringify({
      email: apt.userEmail,
      date: apt.appointmentDate,
      googleEventId: apt.googleEventId,
      googleMeetLink: apt.googleMeetLink,
      googleEventLink: apt.googleEventLink
    }, null, 2));
  } else {
    console.log('Appointment not found');
  }
  process.exit(0);
}
checkAppointment();

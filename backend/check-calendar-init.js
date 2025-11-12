require('dotenv').config();
const googleCalendar = require('./services/googleCalendar');

async function test() {
  console.log('Testing Google Calendar initialization...');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not set');
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not set');
  console.log('GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? '✅ Set' : '❌ Not set');
  console.log('DOCTOR_EMAIL:', process.env.DOCTOR_EMAIL ? '✅ Set to: ' + process.env.DOCTOR_EMAIL : '❌ Not set');
  
  const result = await googleCalendar.initialize();
  console.log('Initialization result:', result);
  process.exit(0);
}
test();

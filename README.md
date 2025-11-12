# 🏥 Doctor Appointment Management Platform

A full-stack appointment management platform optimized for LLM/AI agents. Features both a modern web interface and simplified API endpoints for voice AI and chatbot integration.

## 📋 Features

### 🤖 LLM API (Optimized for AI Agents)
- **8 Simple Endpoints** for complete appointment management
- **90% Performance Improvement** - Check entire week in 1 API call instead of 7
- **Minimal Parameters** - Easy for LLM function calling
- **Google Calendar Integration** - Automatic event creation and email invitations
- **Google Meet Links** - Video consultation links auto-generated
- See `LLM_API_SIMPLE_GUIDE.md` for complete documentation

### Backend API
- **Appointment Management**
  - Create, view, update, cancel appointments
  - Status tracking (scheduled, completed, cancelled, rescheduled)
  - Email notifications to both doctor and patient
  - Google Calendar integration with reminders

- **Slot Management**
  - Individual or bulk slot creation
  - Automated realistic schedule generator (3 months of data)
  - Automatic slot booking/releasing
  - Weekday-only scheduling with professional hours

- **Data Validation**
  - Email validation and conflict detection
  - Date/time validation
  - Input sanitization

### Frontend UI
- **Modern, Responsive Design**
  - Beautiful gradient-based UI
  - Mobile-friendly responsive layout
  - Smooth animations and transitions
  - Toast notifications for user feedback

- **Three Main Sections**
  1. **Book Appointment**: Browse available slots and book appointments
  2. **My Appointments**: View, edit, cancel, or delete appointments
  3. **Manage Slots**: Create and manage available time slots (admin)

## 🚀 Quick Start

**For LLM Integration:** See `LLM_API_SIMPLE_GUIDE.md` ⭐

**For Full Setup:** See `SETUP_GUIDE.md`

**Production URL:** `https://appointmentmangement-production.up.railway.app/api/llm`

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) or MongoDB Atlas
- npm or yarn
- Google Calendar API credentials (optional, for email notifications)

### Installation

#### 1. Clone or navigate to the project directory
```bash
cd /home/ilya/Desktop/appointment_mangement
```

#### 2. Set up the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables (create .env file)
# See SETUP_GUIDE.md for details

# Create realistic schedule (3 months of appointments)
npm run create-slots

# Start the backend server
npm start
```

The backend server will start on `http://localhost:5000`

#### 3. Set up the Frontend

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will start on `http://localhost:3000`

### Database Setup

See `SETUP_GUIDE.md` for complete database configuration.

## 📡 API Endpoints

### 🤖 LLM API (Optimized for AI Agents)

**Base URL:** `/api/llm`

**8 Simple Endpoints:**

Availability:
- `POST /check-availability` - Check single day
- `POST /check-availability-next-days` - Check next N days ⚡ (90% faster!)
- `POST /check-availability-range` - Check date range ⚡
- `POST /get-next-available` - Get soonest slots ⚡

Management:
- `POST /book-appointment` - Book with auto calendar invite
- `POST /get-appointments` - View patient appointments
- `POST /cancel-appointment` - Cancel with notification
- `POST /reschedule-appointment` - Reschedule with notification

**See `LLM_API_SIMPLE_GUIDE.md` for complete documentation with examples.**

### REST API

**Full REST endpoints:** See `API_DOCUMENTATION.md` for complete reference.

**Quick reference:**
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/slots` - List slots
- `POST /api/slots` - Create slot
- `GET /api/health` - Health check

## 🗂️ Project Structure

```
appointment_mangement/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── Appointment.js       # Appointment schema
│   │   └── AvailableSlot.js     # Slot schema
│   ├── routes/
│   │   ├── appointments.js      # Appointment routes
│   │   └── slots.js             # Slot routes
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Express server
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentBooking.js
│   │   │   ├── AppointmentBooking.css
│   │   │   ├── AppointmentList.js
│   │   │   ├── AppointmentList.css
│   │   │   ├── SlotManagement.js
│   │   │   └── SlotManagement.css
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🎨 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **CSS3** - Styling with modern features

## 🔒 Data Models

### Appointment Model
```javascript
{
  userEmail: String (required, validated),
  doctorId: String (default: 'doctor1'),
  appointmentDate: Date (required),
  startTime: String (required),
  endTime: String (required),
  note: String (optional, max 500 chars),
  status: String (enum: scheduled, completed, cancelled, rescheduled),
  createdAt: Date,
  updatedAt: Date
}
```

### Available Slot Model
```javascript
{
  doctorId: String (default: 'doctor1'),
  date: Date (required),
  startTime: String (required),
  endTime: String (required),
  isBooked: Boolean (default: false),
  appointmentId: ObjectId (reference to Appointment),
  createdAt: Date
}
```

## 🔧 Configuration

See `SETUP_GUIDE.md` and `GOOGLE_CALENDAR_SETUP.md` for complete configuration details.

### Essential Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/appointment_management

# Google Calendar (optional but recommended)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
DOCTOR_EMAIL=doctor@example.com

# Server
PORT=5000
```

## 📱 Usage Guide

### For Patients

1. **Booking an Appointment**
   - Go to "Book Appointment" tab
   - Select a date from the calendar
   - Choose an available time slot
   - Enter your email and any notes
   - Click "Confirm Booking"

2. **Managing Appointments**
   - Go to "My Appointments" tab
   - Filter by email to see your appointments
   - Edit appointment details by clicking "Edit"
   - Cancel appointments if needed

### For Administrators

1. **Creating Time Slots**
   - Go to "Manage Slots" tab
   - Choose "Single Slot" for one slot or "Bulk Create" for multiple
   - For bulk creation:
     - Set date range
     - Define time slots for each day
     - Optionally exclude weekends
   - Click "Create" to add slots

2. **Managing Slots**
   - View all existing slots in the table
   - Delete unbooked slots if needed
   - Booked slots cannot be deleted (cancel appointment first)

## 🚨 Error Handling

The application includes comprehensive error handling:
- Input validation on both frontend and backend
- Duplicate booking prevention
- Clear error messages via toast notifications
- Proper HTTP status codes in API responses

## 🔐 Security Features

- Email validation and sanitization
- SQL/NoSQL injection prevention via Mongoose
- Input length limits
- CORS configuration
- Environment variable protection

## 🌐 Integration with Other Platforms

This platform is designed to be integrated as part of a larger healthcare system:

- **RESTful API**: Easy integration with other services
- **Modular Design**: Can be embedded or used standalone
- **Doctor ID Support**: Ready for multi-doctor environments
- **Extensible**: Easy to add features like authentication, notifications, etc.

## ✅ Implemented Features

- ✅ Email notifications (Google Calendar)
- ✅ Video consultation links (Google Meet)
- ✅ LLM/AI agent integration (8 optimized endpoints)
- ✅ Automated realistic schedule generation
- ✅ Doctor and patient notifications
- ✅ Calendar event management

## 📈 Potential Future Enhancements

- User authentication and authorization
- SMS reminders
- Multiple doctors support
- Patient history tracking
- Payment integration
- Recurring appointments

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify MongoDB connection string in .env
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check proxy configuration in frontend/package.json
- Look for CORS errors in browser console

### Slots not showing
- Ensure slots are created for future dates
- Check if slots are marked as available
- Verify date format is correct

## 📄 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Developer

Built with ❤️ for efficient healthcare appointment management.

## 📚 Documentation

- **`LLM_API_SIMPLE_GUIDE.md`** ⭐ - LLM/AI agent integration (8 endpoints)
- **`API_DOCUMENTATION.md`** - Complete REST API reference
- **`SETUP_GUIDE.md`** - Installation and configuration
- **`GOOGLE_CALENDAR_SETUP.md`** - Email notifications setup
- **`DEPLOYMENT.md`** - Deploy to Railway/production

## 🧪 Testing

**Postman Collections:**
- `LLM_Simple.postman_collection.json` - 8 LLM endpoints
- `Appointment_Management_API.postman_collection.json` - Complete API
- `LLM_FUNCTION_CALLING.json` - Function schemas for LLMs

**Test locally:**
```bash
cd backend
npm run create-slots  # Create realistic data
npm start             # Start server

# Test LLM API
curl -X POST http://localhost:5000/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

---

**Production-ready with LLM optimization and Google Calendar integration!** 🚀


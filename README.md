# 🏥 Doctor Appointment Management Platform

A full-stack appointment management platform for doctors that allows patients to book, view, and manage appointments through an intuitive web interface.

## 📋 Features

### Backend API
- **Appointment Management**
  - Create new appointments with user email, date, time, and notes
  - View all appointments with filtering by email, date, and status
  - Update existing appointments (reschedule, modify details)
  - Cancel or delete appointments
  - Status tracking (scheduled, completed, cancelled, rescheduled)

- **Slot Management**
  - Create individual time slots
  - Bulk create slots for date ranges
  - Automatic slot booking/releasing on appointment changes
  - View available and booked slots
  - Weekend exclusion option for bulk creation

- **Data Validation**
  - Email validation
  - Date and time validation
  - Conflict detection (prevent double-booking)
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

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

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

# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB connection string

# FOR MONGODB ATLAS (Recommended):
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/appointment_management?retryWrites=true&w=majority

# FOR LOCAL MONGODB:
# MONGODB_URI=mongodb://localhost:27017/appointment_management

# Start the backend server
npm start

# For development with auto-reload
npm run dev
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

#### Option 1: MongoDB Atlas (Recommended - No Installation!)

Use cloud-hosted MongoDB - **free and no local installation required**:

1. Follow the guide: [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)
2. Get your connection string from Atlas
3. Update `backend/.env` with your Atlas connection string

**Quick steps:**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create M0 FREE cluster
- Get connection string
- Update `.env` file

See [QUICK_START_ATLAS.md](QUICK_START_ATLAS.md) for fastest setup!

#### Option 2: Local MongoDB

If you prefer local installation:

```bash
# Start MongoDB (Linux/Mac)
sudo systemctl start mongod

# Or using Docker
docker run -d --name appointment-mongodb -p 27017:27017 mongo:latest
```

## 📡 API Endpoints

### Appointments

#### Get All Appointments
```http
GET /api/appointments
Query Parameters:
  - email: Filter by user email
  - date: Filter by date (ISO 8601 format)
  - status: Filter by status (scheduled, completed, cancelled, rescheduled)
```

#### Get Single Appointment
```http
GET /api/appointments/:id
```

#### Create Appointment
```http
POST /api/appointments
Body:
{
  "userEmail": "user@example.com",
  "appointmentDate": "2025-10-25",
  "startTime": "09:00",
  "endTime": "09:30",
  "note": "Regular checkup",
  "doctorId": "doctor1"
}
```

#### Update Appointment
```http
PUT /api/appointments/:id
Body: (all fields optional)
{
  "userEmail": "newemail@example.com",
  "appointmentDate": "2025-10-26",
  "startTime": "10:00",
  "endTime": "10:30",
  "note": "Updated note",
  "status": "rescheduled"
}
```

#### Delete Appointment
```http
DELETE /api/appointments/:id
```

### Slots

#### Get All Slots
```http
GET /api/slots
Query Parameters:
  - date: Filter by date
  - doctorId: Filter by doctor
  - available: Filter by availability (true/false)
```

#### Create Single Slot
```http
POST /api/slots
Body:
{
  "date": "2025-10-25",
  "startTime": "09:00",
  "endTime": "09:30",
  "doctorId": "doctor1"
}
```

#### Create Bulk Slots
```http
POST /api/slots/bulk
Body:
{
  "startDate": "2025-10-25",
  "endDate": "2025-10-31",
  "excludeWeekends": true,
  "timeSlots": [
    { "startTime": "09:00", "endTime": "09:30" },
    { "startTime": "09:30", "endTime": "10:00" }
  ],
  "doctorId": "doctor1"
}
```

#### Delete Slot
```http
DELETE /api/slots/:id
```

### Health Check
```http
GET /api/health
```

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

### Backend Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appointment_management
NODE_ENV=development
```

### Frontend Configuration
The frontend is configured to proxy API requests to `http://localhost:5000` in development mode (see `package.json`).

For production, set the `REACT_APP_API_URL` environment variable:
```env
REACT_APP_API_URL=https://your-api-domain.com/api
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

## 📈 Future Enhancements

Potential improvements:
- User authentication and authorization
- Email notifications for appointments
- SMS reminders
- Multiple doctors support with calendar view
- Patient history tracking
- Payment integration
- Video consultation links
- Recurring appointments
- Appointment types and durations
- Doctor availability management

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

---

For questions or issues, please check the API documentation above or review the code comments.


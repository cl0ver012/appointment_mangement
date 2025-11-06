# Backend - Appointment Management API

RESTful API for managing doctor appointments and time slots.

## Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/
│   ├── Appointment.js       # Appointment data model
│   └── AvailableSlot.js     # Time slot data model
├── routes/
│   ├── appointments.js      # Appointment endpoints
│   └── slots.js             # Slot management endpoints
├── .env.example             # Environment variables template
├── package.json
└── server.js                # Main application entry point
```

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appointment_management
NODE_ENV=development
```

## Running

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

See `API_DOCUMENTATION.md` in the root directory for complete API reference.

### Quick Reference

- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/slots` - Get available slots
- `POST /api/slots` - Create single slot
- `POST /api/slots/bulk` - Create multiple slots
- `DELETE /api/slots/:id` - Delete slot
- `GET /api/health` - Health check

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **body-parser** - Request body parsing
- **express-validator** - Input validation

## Development

For development with auto-reload:
```bash
npm install -g nodemon
npm run dev
```


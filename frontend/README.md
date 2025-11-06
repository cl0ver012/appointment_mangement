# Frontend - Appointment Management UI

Modern React-based user interface for the Appointment Management Platform.

## Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AppointmentBooking.js    # Booking interface
│   │   ├── AppointmentBooking.css
│   │   ├── AppointmentList.js       # Appointment management
│   │   ├── AppointmentList.css
│   │   ├── SlotManagement.js        # Admin slot management
│   │   └── SlotManagement.css
│   ├── services/
│   │   └── api.js                   # API service layer
│   ├── App.js                       # Main app component
│   ├── App.css
│   ├── index.js                     # Entry point
│   └── index.css
└── package.json
```

## Installation

```bash
npm install
```

## Running

Development mode:
```bash
npm start
```

Runs on `http://localhost:3000`

Build for production:
```bash
npm run build
```

## Features

### 1. Book Appointment
- Date picker for appointment selection
- Visual display of available time slots
- Email validation
- Optional notes field
- Real-time slot availability

### 2. My Appointments
- View all appointments
- Filter by email and status
- Edit appointment details
- Cancel appointments
- Delete appointments
- Status badges (scheduled, completed, cancelled, rescheduled)

### 3. Manage Slots
- Create single time slots
- Bulk create slots for date ranges
- Weekend exclusion option
- View all slots with status
- Delete available slots
- Protection against deleting booked slots

## Configuration

### API URL Configuration

Development: Automatically proxies to `http://localhost:5000`

Production: Set environment variable:
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Styling

- Modern gradient-based design
- Fully responsive (mobile-friendly)
- Smooth animations and transitions
- Intuitive user experience
- Toast notifications for feedback

## Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **axios** - HTTP client
- **react-toastify** - Toast notifications
- **react-calendar** - Date picker (if used)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

Hot reload is enabled by default in development mode. Changes will automatically refresh the browser.


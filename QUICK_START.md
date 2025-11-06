# ⚡ Quick Start Guide

Get the Appointment Management Platform running in under 5 minutes!

## Prerequisites

Make sure you have these installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm

## Step 1: Start MongoDB (30 seconds)

```bash
# Start MongoDB service
sudo systemctl start mongod

# Verify it's running
sudo systemctl status mongod
```

## Step 2: Backend Setup (2 minutes)

Open a terminal:

```bash
# Navigate to backend directory
cd /home/ilya/Desktop/appointment_mangement/backend

# Install dependencies
npm install

# Start the server
npm start
```

Wait for: `Server is running on port 5000` and `MongoDB Connected`

**✓ Backend is ready!** Keep this terminal open.

## Step 3: Frontend Setup (2 minutes)

Open a **NEW** terminal:

```bash
# Navigate to frontend directory
cd /home/ilya/Desktop/appointment_mangement/frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Your browser should automatically open to `http://localhost:3000`

**✓ Frontend is ready!**

## Step 4: Initialize Sample Data (30 seconds)

Open a **THIRD** terminal:

```bash
# Navigate to backend directory
cd /home/ilya/Desktop/appointment_mangement/backend

# Run initialization script
node init-sample-data.js
```

This creates sample time slots for the next 14 days.

**✓ Sample data loaded!**

## 🎉 You're All Set!

Your application is now running:

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## Try It Out

### 1. Book an Appointment (1 minute)

1. Go to http://localhost:3000
2. Stay on the "Book Appointment" tab
3. Select tomorrow's date
4. Click any available time slot
5. Enter your email: `test@example.com`
6. Add a note: "First appointment"
7. Click "Confirm Booking"

**Success!** You should see a success notification.

### 2. View Your Appointment (30 seconds)

1. Click the "My Appointments" tab
2. Enter your email in the filter: `test@example.com`
3. You'll see your booked appointment

### 3. Try Slot Management (30 seconds)

1. Click the "Manage Slots" tab
2. View all available and booked slots
3. Try creating a new slot or using bulk create

## Common Issues

### "Cannot connect to MongoDB"
```bash
sudo systemctl start mongod
```

### "Port 5000 already in use"
```bash
# Kill the process using port 5000
sudo lsof -ti:5000 | xargs kill -9
# Then restart: npm start
```

### "No slots available"
```bash
# Run the initialization script again
cd backend
node init-sample-data.js
```

## What's Next?

- Read [README.md](README.md) for detailed features
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- See [SETUP_GUIDE.md](SETUP_GUIDE.md) for troubleshooting
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Stop the Application

To stop the servers:
1. Go to each terminal
2. Press `Ctrl + C`

To stop MongoDB:
```bash
sudo systemctl stop mongod
```

---

**Need help?** Check the documentation files or review the error messages in the terminal.

**Ready to build more?** The codebase is well-structured and documented for easy customization!


# 🚀 Quick Setup Guide

This guide will help you get the Appointment Management Platform up and running in minutes.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) - Check with `node --version`
- ✅ npm (v6+) - Check with `npm --version`
- ✅ MongoDB (v4.4+) - Check with `mongod --version`

## Step-by-Step Setup

### 1. Start MongoDB

First, make sure MongoDB is running:

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# If not running, start it
sudo systemctl start mongod

# Enable MongoDB to start on boot (optional)
sudo systemctl enable mongod
```

### 2. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd /home/ilya/Desktop/appointment_mangement/backend

# Install dependencies
npm install

# The .env file should already be created, verify it exists
cat .env

# Start the backend server
npm start
```

You should see:
```
Server is running on port 5000
MongoDB Connected: localhost
```

**Keep this terminal open!**

### 3. Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd /home/ilya/Desktop/appointment_mangement/frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The browser should automatically open to `http://localhost:3000`

**Keep this terminal open too!**

## 🎉 You're Ready!

The application should now be running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📝 First Steps

### 1. Create Some Time Slots

Before users can book appointments, you need to create available time slots:

1. Go to the **"Manage Slots"** tab
2. Click on **"Bulk Create"**
3. Set your date range (e.g., next 7 days)
4. Keep the default time slots or modify them
5. Check "Exclude Weekends" if desired
6. Click **"Create Bulk Slots"**

### 2. Book Your First Appointment

1. Go to the **"Book Appointment"** tab
2. Select a date
3. Choose an available time slot
4. Enter your email and any notes
5. Click **"Confirm Booking"**

### 3. View and Manage Appointments

1. Go to the **"My Appointments"** tab
2. Filter by email to see specific appointments
3. Edit, cancel, or delete appointments as needed

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error**: `MongoNetworkError: connect ECONNREFUSED`

**Solution**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**: Either:
1. Stop the process using port 5000:
   ```bash
   sudo lsof -ti:5000 | xargs kill -9
   ```
2. Or change the port in `backend/.env`:
   ```env
   PORT=5001
   ```

### Frontend Can't Connect to Backend

**Error**: Network errors when booking appointments

**Solution**:
1. Verify backend is running on port 5000
2. Check browser console for errors
3. Ensure both servers are running

### Missing Dependencies

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# In backend directory
cd backend
rm -rf node_modules package-lock.json
npm install

# In frontend directory
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Restarting the Application

### To stop the servers:
- Press `Ctrl + C` in each terminal

### To start again:

**Backend**:
```bash
cd /home/ilya/Desktop/appointment_mangement/backend
npm start
```

**Frontend**:
```bash
cd /home/ilya/Desktop/appointment_mangement/frontend
npm start
```

## 💾 Database Management

### View Database Contents

Using MongoDB Compass (GUI):
1. Download from https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Select `appointment_management` database

Using MongoDB Shell:
```bash
# Connect to MongoDB
mongosh

# Switch to the database
use appointment_management

# View all appointments
db.appointments.find().pretty()

# View all slots
db.availableslots.find().pretty()
```

### Clear Database (Reset)

**⚠️ Warning: This will delete all data!**

```bash
mongosh
use appointment_management
db.appointments.deleteMany({})
db.availableslots.deleteMany({})
```

## 🚀 Production Deployment

For production deployment:

1. **Backend**:
   ```bash
   cd backend
   npm install --production
   # Set environment variables
   export NODE_ENV=production
   export MONGODB_URI=your_production_mongodb_uri
   # Use a process manager like PM2
   npm install -g pm2
   pm2 start server.js --name appointment-backend
   ```

2. **Frontend**:
   ```bash
   cd frontend
   # Set production API URL
   export REACT_APP_API_URL=https://your-api-domain.com/api
   # Build for production
   npm run build
   # Serve with a static server (nginx, serve, etc.)
   ```

## 📞 Getting Help

If you encounter issues:
1. Check the error message in the terminal
2. Look for errors in the browser console (F12)
3. Review the troubleshooting section above
4. Check the main README.md for API documentation

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend server started successfully (port 5000)
- [ ] Frontend development server started (port 3000)
- [ ] Can access http://localhost:3000 in browser
- [ ] Can access http://localhost:5000/api/health in browser
- [ ] Created some time slots
- [ ] Successfully booked a test appointment

If all items are checked, you're all set! 🎉

---

**Happy scheduling!** 📅


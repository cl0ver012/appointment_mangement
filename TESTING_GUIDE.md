# 🧪 Complete Testing Guide

## Part 1: Testing with Postman

### Step 1: Import Collection

1. Open Postman
2. Click "Import" (top left)
3. Select file: `Appointment_Management_API.postman_collection.json`
4. Click "Import"

### Step 2: Test Health Check

**Request:** `Health Check > Check API Health`

1. Click on the request
2. Click "Send" button
3. **Expected Response:**
```json
{
  "success": true,
  "message": "Appointment Management API is running",
  "timestamp": "2025-11-02T17:30:00.000Z"
}
```

✅ If you see this, your API is working!

### Step 3: Check Available Slots

**Request:** `Slots > Get Available Slots`

1. Click on the request
2. Click "Send"
3. **Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "date": "2025-11-02T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "09:30",
      "isBooked": false,
      ...
    }
  ],
  "count": 117
}
```

✅ You should see ~117 available slots (from demo data)

### Step 4: Create a Test Appointment

**Request:** `Voice AI Examples > 2. Book Appointment for Patient`

1. Click on the request
2. Review the request body in the "Body" tab
3. **Update the date to tomorrow's date** (format: YYYY-MM-DD)
4. Click "Send"
5. **Expected Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "673abc123...",
    "userEmail": "patient@email.com",
    "appointmentDate": "2025-11-03T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "scheduled",
    "googleEventId": null,          // Will be set if Google Calendar configured
    "googleEventLink": null,        // Will be set if Google Calendar configured
    "googleMeetLink": null,         // Will be set if Google Calendar configured
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

✅ **Save the `_id`** - you'll need it for next tests!

### Step 5: Verify in Dashboard

1. Go to http://localhost:3000
2. **Wait 10 seconds** (auto-refresh) OR refresh browser
3. Check the dashboard:
   - **KPIs updated**: Should show new appointment count
   - **Upcoming Appointments**: Should show your new appointment
   - **Recent Activity**: Should show "Appointment scheduled"

✅ Dashboard updates in real-time!

### Step 6: Update the Appointment

**Request:** `Appointments > Update Appointment`

1. Click on the request
2. In the URL, replace `:id` with the appointment ID you saved
3. Modify the body (change date/time/note)
4. Click "Send"
5. **Expected Response:**
```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {
    "_id": "...",
    "status": "rescheduled",
    ...
  }
}
```

✅ Check dashboard again - updates should appear!

### Step 7: Cancel the Appointment

**Request:** `Appointments > Cancel Appointment`

1. Replace `:id` with your appointment ID
2. Click "Send"
3. **Expected Response:**
```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {
    "status": "cancelled",
    ...
  }
}
```

✅ Dashboard should show cancelled status!

### Step 8: Test Error Handling

Try creating an appointment with invalid data:

**Request:** `Appointments > Create Appointment`

Change body to:
```json
{
  "userEmail": "invalid-email-format",
  "appointmentDate": "2025-11-03",
  "startTime": "10:00"
  // Missing endTime - should fail
}
```

**Expected Response:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "...",
      "message": "..."
    }
  ]
}
```

✅ Error handling works!

---

## Part 2: Testing Google Calendar Integration

### Check Current Status

**Method 1: Backend Logs**

Look at your backend terminal:
```
⚠️  Google Calendar integration not configured. 
    Appointments will be created without calendar events.
```

This means Google Calendar is **NOT configured** yet.

**Method 2: API Response**

When you create an appointment, check these fields:
```json
{
  "googleEventId": null,      // ❌ Not configured
  "googleEventLink": null,    // ❌ Not configured  
  "googleMeetLink": null      // ❌ Not configured
}
```

If these are `null`, Google Calendar is not active.

### How to Enable Google Calendar

Follow the setup guide: `GOOGLE_CALENDAR_SETUP.md`

Quick summary:
1. Create Google Cloud project
2. Enable Calendar API
3. Create OAuth credentials
4. Add credentials to `.env` file:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REFRESH_TOKEN=your_refresh_token
   ```
5. Restart backend

### Test Google Calendar Integration

**After setup, create a new appointment:**

1. **Via Postman:**
   - Create appointment as before
   - Check response:
   ```json
   {
     "googleEventId": "abc123xyz",           // ✅ Has value!
     "googleEventLink": "https://calendar.google.com/...",  // ✅ Link!
     "googleMeetLink": "https://meet.google.com/xyz-abc"    // ✅ Meet link!
   }
   ```

2. **Check Your Google Calendar:**
   - Open https://calendar.google.com
   - Look for the event with:
     - Title: "Doctor Appointment - patient@email.com"
     - Date/time matches your appointment
     - Google Meet link in description

3. **Check Patient Email:**
   - Patient receives email invitation
   - Can add to their calendar
   - Can join via Google Meet link

### Verify Calendar Sync

**Create appointment via Postman:**
```json
{
  "userEmail": "your-email@gmail.com",
  "appointmentDate": "2025-11-03",
  "startTime": "14:00",
  "endTime": "14:30",
  "note": "Test Google Calendar sync"
}
```

**Then check:**
- ✅ Event appears in Google Calendar
- ✅ Email invitation received
- ✅ Google Meet link works
- ✅ Reminders set (24h and 30min before)

**Update the appointment:**
```json
{
  "startTime": "15:00",
  "endTime": "15:30"
}
```

**Then check:**
- ✅ Calendar event updated
- ✅ New email sent to attendee

**Cancel the appointment:**
```json
{
  "status": "cancelled"
}
```

**Then check:**
- ✅ Calendar event deleted
- ✅ Cancellation email sent

---

## Part 3: Visual Testing in Dashboard

### Real-Time Updates Test

1. **Open Dashboard:** http://localhost:3000

2. **Note current metrics:**
   - Today's Appointments: X
   - Available Slots: Y

3. **Create appointment via Postman**

4. **Wait 10 seconds** (auto-refresh interval)

5. **Verify updates:**
   - ✅ Today's Appointments: X + 1
   - ✅ Available Slots: Y - 1
   - ✅ New appointment in "Upcoming Appointments"
   - ✅ Activity in "Recent Activity" feed

### Voice AI Simulation Test

Simulate a voice AI conversation:

**1. Patient: "What slots are available tomorrow?"**
- Postman: `GET /api/slots?date=2025-11-03&available=true`
- Response: List of available slots

**2. Patient: "Book me for 10 AM"**
- Postman: `POST /api/appointments`
- Body: Use 10:00 as startTime
- Response: Appointment created

**3. Patient: "What are my appointments?"**
- Postman: `GET /api/appointments?email=patient@email.com`
- Response: List of patient's appointments

**4. Patient: "Reschedule to 2 PM"**
- Postman: `PUT /api/appointments/:id`
- Body: Change startTime to 14:00
- Response: Appointment updated

**5. Check dashboard**
- All changes visible in real-time!

---

## Part 4: Integration Testing Checklist

### Basic API Tests
- [ ] Health check returns success
- [ ] Can retrieve all appointments
- [ ] Can filter appointments by email
- [ ] Can filter appointments by date
- [ ] Can filter appointments by status
- [ ] Can create new appointment
- [ ] Can update appointment
- [ ] Can cancel appointment
- [ ] Can delete appointment

### Slot Management Tests
- [ ] Can retrieve all slots
- [ ] Can filter available slots
- [ ] Can filter slots by date
- [ ] Can create single slot
- [ ] Can create bulk slots
- [ ] Cannot delete booked slot
- [ ] Can delete available slot

### Data Validation Tests
- [ ] Invalid email rejected
- [ ] Missing required fields rejected
- [ ] Invalid date format rejected
- [ ] Double-booking prevented
- [ ] Past dates rejected (for booking)

### Dashboard Tests
- [ ] KPIs display correctly
- [ ] Today's appointments count accurate
- [ ] Weekly appointments count accurate
- [ ] Utilization rate calculated correctly
- [ ] Upcoming appointments list shows correctly
- [ ] Recent activity feed updates
- [ ] Auto-refresh works (10 seconds)

### Google Calendar Tests (If Configured)
- [ ] Calendar event created
- [ ] Google Meet link generated
- [ ] Email invitation sent
- [ ] Event updates when appointment rescheduled
- [ ] Event deleted when appointment cancelled
- [ ] Reminders configured correctly

---

## Common Test Scenarios

### Scenario 1: Complete Booking Flow
1. GET available slots
2. POST create appointment
3. Verify in dashboard
4. Check Google Calendar (if configured)
5. GET appointment by ID
6. Verify all fields correct

### Scenario 2: Rescheduling
1. Create appointment
2. Update with new date/time
3. Verify status changed to "rescheduled"
4. Check calendar event updated
5. Verify dashboard shows update

### Scenario 3: Cancellation
1. Create appointment
2. Cancel via PUT (status: cancelled)
3. Verify slot released
4. Check calendar event deleted
5. Verify dashboard updates

### Scenario 4: Error Handling
1. Try double-booking same slot
2. Try invalid email format
3. Try missing required fields
4. Try booking past date
5. Verify proper error messages

---

## Troubleshooting

### Postman Issues

**"Could not get response"**
- Check backend is running
- Verify URL is correct: http://localhost:5000/api
- Check firewall settings

**"404 Not Found"**
- Verify endpoint path is correct
- Check base_url variable in collection
- Ensure backend is running

**"Validation errors"**
- Check request body format
- Verify all required fields present
- Check data types (string, date, etc.)

### Dashboard Issues

**Dashboard not updating**
- Refresh browser (Ctrl+R)
- Wait 10 seconds for auto-refresh
- Check browser console for errors
- Verify backend is running

**Wrong data showing**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check API directly via Postman

### Google Calendar Issues

**No calendar events created**
- Check backend logs for errors
- Verify credentials in .env file
- Test authorization flow again
- Check "googleEventId" in response (should not be null)

**Events created but not visible**
- Check correct Google account
- Verify calendar permissions
- Check spam/junk folder for emails
- Try different calendar view

---

## Quick Test Command

**Test all core features in 5 minutes:**

1. Health Check ✓
2. Get available slots ✓
3. Create appointment ✓
4. Verify in dashboard ✓
5. Update appointment ✓
6. Check dashboard update ✓
7. Cancel appointment ✓
8. Verify cancellation ✓

**All working?** You're ready to demo! 🎉

---

## Performance Metrics

Expected response times (local):
- GET requests: < 100ms
- POST/PUT requests: < 200ms
- Dashboard load: < 1s
- Auto-refresh: Every 10s

Database:
- Total slots: 120
- Available slots: ~117
- Demo appointments: 3-4

---

**Need help?** Check the error message in Postman or backend logs for details!


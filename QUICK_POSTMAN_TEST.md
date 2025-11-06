# 🚀 Quick Postman Test - 5 Minutes

## Step-by-Step: Setup Your First Meeting

### 1. Import Collection (30 seconds)

**In Postman:**
- Click **"Import"** (top left)
- Select file: `Appointment_Management_API.postman_collection.json`
- Click **"Import"**
- ✅ Collection appears in sidebar

---

### 2. Test Health Check (10 seconds)

**Navigate:**
- Expand **"Health Check"** folder
- Click **"Check API Health"**
- Click **"Send"** button

**Expected Response:**
```json
{
  "success": true,
  "message": "Appointment Management API is running"
}
```

✅ API is working!

---

### 3. Check Available Slots (30 seconds)

**Navigate:**
- Expand **"Voice AI Examples"** folder  
- Click **"1. Check Available Slots for Tomorrow"**

**Update the date:**
- Click **"Params"** tab
- Change `date` to tomorrow (format: `2025-11-07`)
- Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "startTime": "09:00",
      "endTime": "09:30",
      "isBooked": false
    },
    {
      "startTime": "09:30",
      "endTime": "10:00",
      "isBooked": false
    }
    // ... more slots
  ],
  "count": 12
}
```

✅ Pick a time slot (e.g., "10:00")

---

### 4. Create Appointment / Setup Meeting (1 minute)

**Navigate:**
- Click **"2. Book Appointment for Patient"**

**Update the request body:**
- Click **"Body"** tab
- Modify the JSON:

```json
{
  "userEmail": "yourname@email.com",
  "appointmentDate": "2025-11-07",
  "startTime": "10:00",
  "endTime": "10:30",
  "note": "Testing appointment with Google Calendar"
}
```

- Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "673abc123def456789012345",
    "userEmail": "yourname@email.com",
    "appointmentDate": "2025-11-07T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "note": "Testing appointment with Google Calendar",
    "status": "scheduled",
    
    // 🎯 CHECK THESE FIELDS FOR GOOGLE CALENDAR:
    "googleEventId": "abc123xyz789",              // ✅ Has value = Working!
    "googleEventLink": "https://calendar.google.com/...",  // ✅ Calendar link
    "googleMeetLink": "https://meet.google.com/xxx-yyyy-zzz",  // ✅ Video link!
    
    "createdAt": "2025-11-06T05:20:00.000Z",
    "updatedAt": "2025-11-06T05:20:00.000Z"
  }
}
```

✅ **Meeting created with Google Calendar event and Meet link!**

**Copy the appointment `_id` for later tests**

---

### 5. Verify Google Calendar Integration (2 minutes)

#### ✅ Check 1: API Response

Look at the response from Step 4:

**✅ WORKING:**
```json
{
  "googleEventId": "abc123xyz",           // Has value
  "googleEventLink": "https://...",       // Has link
  "googleMeetLink": "https://meet.google.com/..." // Has Meet link
}
```

**❌ NOT WORKING:**
```json
{
  "googleEventId": null,      // No value
  "googleEventLink": null,    // No value
  "googleMeetLink": null      // No value
}
```

#### ✅ Check 2: Google Calendar

1. Open: **https://calendar.google.com**
2. Navigate to: **November 7, 2025**
3. Look for event: **"Doctor Appointment - yourname@email.com"**
4. Click the event
5. You should see:
   - Event time: 10:00 AM - 10:30 AM
   - Google Meet link (click to join!)
   - Attendee: yourname@email.com
   - Notes in description

#### ✅ Check 3: Test Google Meet Link

1. Copy the `googleMeetLink` from Postman response
2. Paste in browser
3. Should open: **Google Meet video call page**
4. Shows meeting code ready to join!

#### ✅ Check 4: Dashboard

1. Go to: **http://localhost:3000**
2. Wait 10 seconds (auto-refresh) or press F5
3. You should see:
   - **KPIs updated** (Today's appointments +1)
   - **New appointment** in "Upcoming Appointments"
   - **Activity** in "Recent Activity" feed

---

### 6. Update Meeting (Optional - 1 minute)

**Navigate:**
- Click **"4. Reschedule Appointment"**

**Update the URL:**
- Replace `:id` with your appointment ID (from Step 4)
- Example: `http://localhost:5000/api/appointments/673abc123def456789012345`

**Update the body:**
```json
{
  "startTime": "14:00",
  "endTime": "14:30",
  "status": "rescheduled",
  "note": "Rescheduled to afternoon"
}
```

**Click "Send"**

**Result:**
- ✅ Appointment updated
- ✅ Google Calendar event updated automatically
- ✅ New email sent to patient
- ✅ Dashboard shows update

---

## 🎯 Summary: How to Verify Google Calendar

### Quick Checklist:

1. **Create appointment via Postman** ✓
2. **Check API response** for these fields:
   - `googleEventId`: Should have value (not null)
   - `googleMeetLink`: Should have URL
3. **Open Google Calendar** and find the event
4. **Click Meet link** - should work
5. **Check dashboard** - appointment appears

### If Google Calendar is Working:

✅ All three fields (eventId, eventLink, meetLink) have values  
✅ Event visible in Google Calendar  
✅ Meet link opens video call  
✅ Email invitation sent

### If Not Working:

❌ All three fields are `null`  
❌ Backend logs show: "Google Calendar integration not configured"  
❌ No event in Google Calendar  

**Fix:** Follow `GOOGLE_CALENDAR_SETUP.md` or `GOOGLE_AUTH_FIX.md`

---

## 🎤 Voice AI Integration Test

Simulate complete voice AI workflow:

```
Patient: "I need an appointment tomorrow at 10 AM"

1. AI checks: GET /slots?date=2025-11-07&available=true
2. AI books: POST /appointments (with 10:00 time)
3. System creates:
   - Appointment in database
   - Google Calendar event
   - Google Meet link
   - Email invitation
4. Dashboard updates automatically
5. Patient receives email with Meet link
```

**Test this flow in Postman using the Voice AI Examples folder!**

---

**Your app is ready! Just open Postman and follow these steps!** 📮


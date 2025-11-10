# 📧 Email Invitations Setup Guide

## ✅ What Was Fixed

The Google Calendar integration now **automatically sends meeting invitations to both the doctor and patient**!

---

## 🔧 How It Works Now

### When an Appointment is Booked

1. **Calendar Event Created** with:
   - 📅 Appointment date & time
   - 👤 **Patient** as attendee (needs to accept)
   - 🩺 **Doctor** as organizer (auto-accepted)
   - 🎥 Google Meet link (automatically created)
   - ⏰ Reminders (1 day before + 30 min before)

2. **Email Invitations Sent** to:
   - ✉️ **Patient** → Receives invitation with "Accept/Decline" buttons
   - ✉️ **Doctor** → Receives notification (already accepted as organizer)

3. **Both Can Access**:
   - 📆 Calendar event in their Google Calendar
   - 🎥 Google Meet video link
   - 📝 Appointment details and notes

---

## ⚙️ Configuration Required

### Add Doctor Email to Environment Variables

#### Local Development

Create or update `backend/.env`:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/appointment_management

# Google Calendar (if configured)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token

# ⭐ NEW: Doctor Email for Calendar Invitations
DOCTOR_EMAIL=doctor@yourclinic.com

# Timezone
TIMEZONE=America/New_York
```

#### Production (Railway)

1. Go to your Railway project
2. Click on your service
3. Go to **Variables** tab
4. Add new variable:
   - **Name:** `DOCTOR_EMAIL`
   - **Value:** `doctor@yourclinic.com`
5. Save and redeploy

---

## 📧 What Gets Sent

### Patient Email Example

```
Subject: Invitation: Doctor Appointment - patient@example.com @ Thu Nov 7, 2025 2pm - 2:30pm (EST)

From: Doctor <doctor@yourclinic.com>
To: patient@example.com

You have been invited to the following event:

📅 Doctor Appointment - patient@example.com
🕐 Thursday, November 7, 2025
🕑 2:00 PM – 2:30 PM (America/New_York)
📝 Note: Annual checkup
🎥 Join with Google Meet: [Link]

[Yes] [No] [Maybe]

View event details in Google Calendar
```

### Doctor Email Example

```
Subject: Appointment Created: Doctor Appointment - patient@example.com @ Thu Nov 7, 2025 2pm - 2:30pm (EST)

From: Google Calendar
To: doctor@yourclinic.com

You created the following event:

📅 Doctor Appointment - patient@example.com
🕐 Thursday, November 7, 2025
🕑 2:00 PM – 2:30 PM (America/New_York)
📝 Note: Annual checkup
🎥 Join with Google Meet: [Link]
👤 Attendees: patient@example.com (invited)

View event details in Google Calendar
```

---

## 🎯 Features Included

### Calendar Event Settings

✅ **Attendees:**
- Patient (responseStatus: "needsAction")
- Doctor (responseStatus: "accepted", organizer: true)

✅ **Conference:**
- Google Meet link automatically created
- Both attendees can join

✅ **Reminders:**
- Email: 24 hours before appointment
- Popup: 30 minutes before appointment

✅ **Permissions:**
- Guests cannot modify event
- Guests cannot invite others
- Guests can see other attendees

✅ **Email Notifications:**
- Sent when event is created (`sendUpdates: 'all'`)
- Sent when event is updated
- Sent when event is cancelled

---

## 🧪 Testing the Setup

### Test 1: Book an Appointment

```bash
curl -X POST https://your-api.railway.app/api/llm/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "date": "2025-11-10",
    "time": "14:00",
    "note": "Test appointment"
  }'
```

**Expected Result:**
- ✅ Appointment created
- ✅ Google Calendar event created
- ✅ Email sent to `patient@example.com`
- ✅ Email sent to `doctor@yourclinic.com` (if DOCTOR_EMAIL configured)

### Test 2: Check Your Emails

**Patient should receive:**
- Email invitation from Google Calendar
- Subject: "Invitation: Doctor Appointment..."
- With "Accept/Decline" buttons
- With Google Meet link

**Doctor should receive:**
- Email notification from Google Calendar
- Subject: "Appointment Created..."
- Already accepted (as organizer)
- With Google Meet link

### Test 3: Check Google Calendar

Both the doctor and patient should see the event in their Google Calendar with:
- ✅ Correct date & time
- ✅ Appointment details
- ✅ Google Meet link
- ✅ Both attendees listed

---

## 🔄 What Happens During Updates

### When Appointment is Rescheduled

```bash
POST /api/llm/reschedule-appointment
```

**Result:**
- ✅ Calendar event updated
- ✅ Email sent to both (with new date/time)
- ✅ Old slot released
- ✅ New slot booked

### When Appointment is Cancelled

```bash
POST /api/llm/cancel-appointment
```

**Result:**
- ✅ Calendar event deleted
- ✅ Cancellation email sent to both
- ✅ Slot released
- ✅ Event removed from calendars

---

## 📊 Before vs After

### Before (Only Patient)

```javascript
attendees: [
  { email: appointment.userEmail }  // Only patient
]
```

**Result:**
- ❌ Only patient received invitation
- ❌ Doctor had no calendar record
- ❌ Doctor didn't know about appointments

### After (Both Doctor & Patient) ✅

```javascript
attendees: [
  { email: appointment.userEmail, responseStatus: 'needsAction' },  // Patient
  { email: process.env.DOCTOR_EMAIL, responseStatus: 'accepted', organizer: true }  // Doctor
]
```

**Result:**
- ✅ Both receive invitations
- ✅ Doctor's calendar is updated
- ✅ Doctor is marked as organizer
- ✅ Professional appointment management

---

## 🎯 Configuration Examples

### Single Doctor Practice

```bash
# In .env or Railway variables
DOCTOR_EMAIL=dr.smith@clinic.com
```

### Multiple Doctors (Future Enhancement)

For now, use a shared calendar email:

```bash
DOCTOR_EMAIL=appointments@clinic.com
```

Or modify the code to get doctor email from appointment:

```javascript
// In googleCalendar.js
const doctorEmail = appointment.doctorEmail || process.env.DOCTOR_EMAIL;
```

---

## 🚨 Troubleshooting

### Issue: Doctor Not Receiving Emails

**Check:**
1. ✅ `DOCTOR_EMAIL` is set in environment variables
2. ✅ Email address is valid
3. ✅ Check spam/junk folder
4. ✅ Google Calendar is configured correctly

**Test:**
```bash
# Check if variable is set
echo $DOCTOR_EMAIL  # Local
# Or check Railway dashboard > Variables
```

### Issue: No Emails Sent at All

**Check:**
1. ✅ Google Calendar integration is configured
2. ✅ `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` are set
3. ✅ Check server logs for errors

### Issue: Patient Not Receiving Emails

**Check:**
1. ✅ Patient email is valid
2. ✅ Check spam/junk folder
3. ✅ Google Calendar API has email permissions

---

## 📱 Email Content Details

### What Patient Sees

```
From: doctor@yourclinic.com via Google Calendar
Subject: Invitation: Doctor Appointment...

Hi patient@example.com,

You've been invited to:

Doctor Appointment - patient@example.com

When: Thursday, November 7, 2025 ⋅ 2:00 – 2:30pm
Where: Google Meet (link provided)
Calendar: doctor@yourclinic.com

Note: Annual checkup

[Going?] Yes · No · Maybe

Join with Google Meet
https://meet.google.com/abc-defg-hij

Or dial: (US) +1 234-567-8900 PIN: 123 456 789#
```

### What Doctor Sees

```
From: Google Calendar
Subject: Appointment Created...

You created:

Doctor Appointment - patient@example.com

When: Thursday, November 7, 2025 ⋅ 2:00 – 2:30pm
Where: Google Meet
Guests: 
  • patient@example.com (invited)

Note: Annual checkup

This event has a video call.
Join with Google Meet
https://meet.google.com/abc-defg-hij
```

---

## ✅ Quick Setup Checklist

### For Production

- [ ] Set `DOCTOR_EMAIL` in Railway variables
- [ ] Redeploy the service
- [ ] Book a test appointment
- [ ] Verify both emails received
- [ ] Check both calendars updated
- [ ] Confirm Google Meet link works

### For Local Development

- [ ] Add `DOCTOR_EMAIL` to `backend/.env`
- [ ] Restart the server
- [ ] Book a test appointment
- [ ] Verify email invitations
- [ ] Test the meeting link

---

## 🎉 Benefits

✅ **Professional Communication**
- Both parties are informed
- Official calendar invitations
- Proper meeting management

✅ **Better Organization**
- Doctor's calendar stays updated
- No manual entry needed
- Automatic reminders

✅ **Improved Patient Experience**
- Clear appointment details
- Easy to accept/decline
- Integrated video meeting

✅ **Compliance & Records**
- Both parties have records
- Email trail for confirmation
- Calendar history maintained

---

## 🔄 Updating Production

### Via Railway Dashboard

1. Go to: https://railway.app/project/[your-project]
2. Select your service
3. Click **Variables** tab
4. Add: `DOCTOR_EMAIL` = `doctor@example.com`
5. Click **Deploy** or wait for auto-deploy

### Via Railway CLI

```bash
railway variables set DOCTOR_EMAIL=doctor@example.com
```

---

## 📚 Related Files

- `backend/services/googleCalendar.js` - Calendar integration (updated)
- `backend/routes/llm-api.js` - Booking endpoints
- `backend/routes/appointments.js` - Appointment routes

---

## 🎯 Summary

**What Changed:**
- ✅ Doctor email now added as attendee
- ✅ Doctor marked as organizer
- ✅ Both receive email invitations
- ✅ Guest permissions properly configured
- ✅ `sendUpdates: 'all'` ensures emails are sent

**What You Need to Do:**
1. Set `DOCTOR_EMAIL` environment variable
2. Redeploy (if needed)
3. Test with a booking
4. Both parties should receive emails!

---

**Your appointment system now properly notifies both doctor and patient!** 📧✅


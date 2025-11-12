# 🔧 Update DOCTOR_EMAIL to Host Account

## 🎯 The Issue

Your `DOCTOR_EMAIL` is currently set to: `doctor@example.com` (placeholder)

But it should be set to: **The actual Google account you authorized**

---

## 🔍 Which Email Should It Be?

The `DOCTOR_EMAIL` should be the **same email you used** when you:
1. Clicked the Google authorization link
2. Signed into Google
3. Clicked "Allow" to grant Calendar permissions

**That email is your "host" email** - where all calendar events are created.

---

## ✅ How to Find Your Host Email

### Option 1: Remember Which Account You Used

When you authorized Google Calendar, which email did you sign in with?
- Was it: `yourname@gmail.com`?
- Was it: `doctor@yourclinic.com`?
- Was it your work email?

**That's your DOCTOR_EMAIL!**

### Option 2: Check Google Calendar

1. Go to: https://calendar.google.com
2. Sign in (if not already)
3. Look at the email in top-right corner
4. **That's the account** with the calendar events

### Option 3: Check Which Account Has the Event

1. Go to Google Calendar: https://calendar.google.com
2. Look for the appointment we just created:
   - **Date:** November 12, 2025 at 11:30 AM
   - **Title:** "Doctor Appointment - james@example.com"
3. The calendar that has this event = Your host email

---

## 🔧 Update DOCTOR_EMAIL

### Step 1: Find the Correct Email

Let's say your host email is: `rahovksy.solutions@gmail.com`

(I'm guessing based on your calendar link, but please verify!)

### Step 2: Update .env File

```bash
cd /home/ilya/Desktop/appointment_mangement/backend
nano .env
```

Find this line:
```bash
DOCTOR_EMAIL=doctor@example.com
```

Change it to:
```bash
DOCTOR_EMAIL=your-actual-email@gmail.com
```

**Example:**
```bash
DOCTOR_EMAIL=rahovksy.solutions@gmail.com
```

Save and exit (Ctrl+X, Y, Enter)

### Step 3: Restart Server

```bash
pkill -f "node.*server.js"
npm start
```

### Step 4: Test Again

```bash
# Get next available slot
curl -s -X POST http://localhost:5000/api/llm/get-next-available \
  -H "Content-Type: application/json" \
  -d '{"limit": 1}'

# Book it
curl -s -X POST http://localhost:5000/api/llm/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient-test@example.com",
    "date": "2025-11-13",
    "time": "10:30",
    "note": "Testing with correct doctor email"
  }' | python3 -m json.tool
```

**Expected:**
```json
{
  "meetLink": "https://meet.google.com/...",  ✅
  "calendarLink": "https://calendar.google.com/..."  ✅
}
```

### Step 5: Check Emails

**Patient email** (`patient-test@example.com`):
- Will receive: Calendar invitation

**Doctor email** (your host email):
- Will receive: Appointment notification
- **This is YOUR email** - check your inbox!

---

## 📧 How to Verify

### Check 1: Google Calendar

1. Go to: https://calendar.google.com
2. Sign in with your host account
3. Look for the appointment event
4. You should see:
   - Event title: "Doctor Appointment - patient-test@example.com"
   - Guests: 2 (you + patient)
   - Google Meet link

### Check 2: Your Email Inbox

Check the inbox of **your host email account**:
- Look for: "Appointment Created" or "Doctor Appointment"
- From: Google Calendar
- Should show the patient as a guest

---

## 🎯 Common Email Options

Your host email is likely one of these:
- `rahovksy.solutions@gmail.com` (based on calendar link)
- Your personal Gmail
- Your work email
- Your clinic email

**Whichever account you used to authorize Google Calendar!**

---

## ✅ Quick Fix Command

If your host email is `rahovksy.solutions@gmail.com`:

```bash
cd /home/ilya/Desktop/appointment_mangement/backend
sed -i 's/DOCTOR_EMAIL=doctor@example.com/DOCTOR_EMAIL=rahovksy.solutions@gmail.com/' .env
echo "✅ Updated DOCTOR_EMAIL"
```

**Replace `rahovksy.solutions@gmail.com` with your actual email!**

---

## 🎯 Summary

**Current Status:**
- ✅ Google Calendar working (events are created)
- ✅ Patient receives invitations
- ⚠️ Doctor email is set to placeholder

**What You Need:**
1. Find which Google account you authorized
2. Set `DOCTOR_EMAIL` to that email
3. Restart server
4. Test - you'll receive notifications!

---

**What's your actual host email? Tell me and I can help you update it!**


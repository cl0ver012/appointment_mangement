# 🚀 Quick Setup: Add Doctor Email to Railway

## ⚡ 3-Minute Setup

### Step 1: Go to Railway Dashboard
```
https://railway.app → Your Project → Your Service
```

### Step 2: Add Environment Variable
1. Click **"Variables"** tab
2. Click **"New Variable"**
3. Enter:
   - **Variable:** `DOCTOR_EMAIL`
   - **Value:** `your-doctor@email.com` (use your actual doctor email)
4. Click **"Add"**

### Step 3: Redeploy (Optional)
Railway will auto-deploy, or click **"Deploy"** to redeploy immediately.

### Step 4: Test It! 🧪
```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "date": "2025-11-10",
    "time": "14:00",
    "note": "Test appointment"
  }'
```

**Expected Result:**
- ✅ Patient receives email invitation
- ✅ Doctor receives email invitation
- ✅ Both have event in Google Calendar
- ✅ Google Meet link created

---

## 📧 What Happens Now

### Before (Without DOCTOR_EMAIL)
```
Appointment Booked
    ↓
Only Patient Receives Email ❌
```

### After (With DOCTOR_EMAIL) ✅
```
Appointment Booked
    ↓
Patient Receives Email ✅
    +
Doctor Receives Email ✅
    +
Both Have Calendar Event ✅
    +
Google Meet Link Created ✅
```

---

## 🎯 Quick Reference

| What | Value |
|------|-------|
| **Variable Name** | `DOCTOR_EMAIL` |
| **Example Value** | `doctor@clinic.com` |
| **Where to Add** | Railway Dashboard → Variables |
| **Required?** | Optional (but highly recommended!) |
| **Effect** | Doctor receives all appointment invitations |

---

## ✅ Verify It's Working

### Check 1: Railway Variables
Go to Railway → Your Service → Variables → Look for `DOCTOR_EMAIL`

### Check 2: Book Test Appointment
Use the API or Postman to book an appointment

### Check 3: Check Emails
- Patient email should receive invitation
- Doctor email should receive notification

### Check 4: Check Calendars
- Both calendars should show the event
- Google Meet link should be present

---

## 🎉 Done!

Your appointment system now sends invitations to both doctor and patient!

**No code changes needed** - just set the environment variable! 🚀


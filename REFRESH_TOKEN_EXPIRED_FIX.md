# 🔧 Fix: Refresh Token Expired

## 🧪 Test Results

**Status:** Google Calendar credentials are configured but the **refresh token has expired**.

**Error:** `invalid_grant` when trying to create calendar events

---

## 🚀 Quick Fix (2 Minutes)

### Your Server is Running Locally

I've started your server at: `http://localhost:5000`

Server logs show:
```
✅ Google Calendar integration initialized
❌ Error creating calendar event: invalid_grant
```

This means your `GOOGLE_REFRESH_TOKEN` expired!

---

## 🔑 Get New Refresh Token

### Step 1: Open This URL

**Copy this entire URL and paste in your browser:**

```
https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events&prompt=consent&response_type=code&client_id=874392875331-qq0rgpl6j7dnm49th7tr7tgagqgh8smt.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fauth%2Fgoogle%2Fcallback
```

### Step 2: Authorize

1. Sign in with the **doctor's Google account**
2. Click **"Allow"** to grant Calendar permissions
3. You'll be redirected to a success page

### Step 3: Copy the New Token

You'll see a page like this:

```html
✅ Authorization Successful!

Add these to your .env file:

GOOGLE_REFRESH_TOKEN=1//0abc123xyz...

You can close this window.
```

**Copy that entire token** (starts with `1//`)

### Step 4: Update Your .env File

```bash
cd /home/ilya/Desktop/appointment_mangement/backend
nano .env  # Or use your favorite editor
```

Update this line:
```bash
GOOGLE_REFRESH_TOKEN=1//0abc123xyz...  ← Paste the NEW token here
```

Also add if missing:
```bash
DOCTOR_EMAIL=your-doctor@email.com
```

Save and exit.

### Step 5: Restart Server & Test

```bash
# Kill current server
pkill -f "node.*server.js"

# Start again
npm start
```

In another terminal:
```bash
# Test booking
curl -X POST http://localhost:5000/api/llm/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "date": "2025-11-13",
    "time": "09:00",
    "note": "Testing with new token"
  }' | python3 -m json.tool
```

**Expected Result:**
```json
{
  "success": true,
  "appointment": {
    "meetLink": "https://meet.google.com/abc-defg-hij",  ✅ Should have value!
    "calendarLink": "https://calendar.google.com/..."    ✅ Should have value!
  }
}
```

---

## 📧 Then Check Emails

After successful booking with new token:

**Check patient email:** `test@example.com`
- Should receive: Calendar invitation

**Check doctor email:** (whatever you set in `DOCTOR_EMAIL`)
- Should receive: Appointment notification

---

## 🎯 Why Tokens Expire

Google refresh tokens can expire if:
- ❌ Not used for 6 months
- ❌ User revoked access
- ❌ Password changed
- ❌ Security issue detected

**Solution:** Just get a new one (takes 2 minutes!)

---

## 📋 Full Process Checklist

- [ ] Open authorization URL in browser
- [ ] Sign in with doctor's Google account
- [ ] Click "Allow" to grant permissions
- [ ] Copy the new refresh token from success page
- [ ] Update `GOOGLE_REFRESH_TOKEN` in `backend/.env`
- [ ] Add `DOCTOR_EMAIL` if not present
- [ ] Restart server
- [ ] Test booking appointment
- [ ] Verify `meetLink` is not null
- [ ] Check patient email for invitation
- [ ] Check doctor email for notification
- [ ] Update token on Railway (same value)

---

## 🚀 After Getting New Token

### Update Both Local and Railway

1. **Local `.env`:**
   ```bash
   GOOGLE_REFRESH_TOKEN=1//new_token_here
   DOCTOR_EMAIL=doctor@example.com
   ```

2. **Railway Variables:**
   - Go to Railway Dashboard
   - Update `GOOGLE_REFRESH_TOKEN` with new value
   - Add `DOCTOR_EMAIL` if not there
   - Save and redeploy

---

## ✅ Success Criteria

When working, you'll see:

**API Response:**
```json
"meetLink": "https://meet.google.com/abc-defg-hij",
"calendarLink": "https://calendar.google.com/event?eid=..."
```

**Emails Sent:**
- ✉️ Patient receives invitation
- ✉️ Doctor receives notification

**Calendar Events:**
- 📅 Both see event in Google Calendar
- 👥 Both listed as attendees
- 🎥 Both can access Google Meet link

---

## 🎯 What to Do NOW

1. **Click this link** (or copy-paste into browser):
   ```
   https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events&prompt=consent&response_type=code&client_id=874392875331-qq0rgpl6j7dnm49th7tr7tgagqgh8smt.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fauth%2Fgoogle%2Fcallback
   ```

2. **Sign in** with your Google account

3. **Allow** Calendar permissions

4. **Copy** the refresh token from the success page

5. **Tell me** when you have it, and I'll help you update it!

---

**Your server is running and ready - we just need a fresh refresh token!** 🔑

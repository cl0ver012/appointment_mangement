# 🔧 Google Calendar API - Quick Setup Guide

## Problem

Your appointments are created but:
- ❌ No calendar events
- ❌ No email invitations
- ❌ No Google Meet links
- ❌ `meetLink: null` and `calendarLink: null`

**Solution:** Configure Google Calendar API credentials

---

## 🚀 Quick Setup (15 Minutes)

### Step 1: Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click **"Select a Project"** → **"New Project"**
3. Name it: `appointment-management`
4. Click **"Create"**

### Step 2: Enable Google Calendar API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for: `Google Calendar API`
3. Click on it
4. Click **"Enable"**

### Step 3: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: `Appointment Management`
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"**
   - Scopes: Skip (click "Save and Continue")
   - Test users: Add your email
   - Click **"Save and Continue"**

4. Back to Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `Appointment Backend`
   - Authorized redirect URIs: Add these:
     - `http://localhost:5000/auth/google/callback`
     - `https://appointmentmangement-production.up.railway.app/auth/google/callback`
   - Click **"Create"**

5. **SAVE THESE VALUES:**
   - Client ID: `123456789-abcdefg.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-abc123xyz789`

### Step 4: Get Refresh Token

#### Method 1: Using Your Backend (Easiest)

1. **Start your backend locally:**
   ```bash
   cd backend
   # Add these to .env temporarily:
   GOOGLE_CLIENT_ID=your_client_id_from_step3
   GOOGLE_CLIENT_SECRET=your_client_secret_from_step3
   
   npm start
   ```

2. **Get Authorization URL:**
   ```bash
   curl http://localhost:5000/api/auth/google/url
   ```

3. **Open the URL in browser:**
   - It will show a long URL like: `https://accounts.google.com/o/oauth2/v2/auth?...`
   - Copy and paste it into your browser
   - Sign in with the doctor's Google account
   - Grant permissions
   - You'll be redirected to: `http://localhost:5000/auth/google/callback?code=...`

4. **Extract the code from URL:**
   - Look for `?code=` in the URL
   - Copy everything after `code=` (before any `&`)

5. **Exchange code for tokens:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/google/callback \
     -H "Content-Type: application/json" \
     -d '{"code": "paste_your_code_here"}'
   ```

6. **SAVE THE REFRESH TOKEN:**
   ```json
   {
     "refresh_token": "1//abc123xyz789...",  ← SAVE THIS!
     "access_token": "...",
     "expiry_date": "..."
   }
   ```

#### Method 2: Using OAuth Playground (Alternative)

1. Go to: https://developers.google.com/oauthplayground/
2. Click settings (gear icon) → Check **"Use your own OAuth credentials"**
3. Enter:
   - OAuth Client ID: Your client ID from Step 3
   - OAuth Client Secret: Your client secret from Step 3
4. In Step 1, select: `Google Calendar API v3`
5. Check: `https://www.googleapis.com/auth/calendar`
6. Click **"Authorize APIs"**
7. Sign in and allow access
8. In Step 2, click **"Exchange authorization code for tokens"**
9. **SAVE THE REFRESH TOKEN** from the response

### Step 5: Add to Railway

1. Go to Railway Dashboard: https://railway.app
2. Select your project → Your service
3. Click **"Variables"** tab
4. Add these 4 variables:

```
GOOGLE_CLIENT_ID = your_client_id_here
GOOGLE_CLIENT_SECRET = your_client_secret_here  
GOOGLE_REFRESH_TOKEN = your_refresh_token_here
DOCTOR_EMAIL = your-doctor@email.com
```

5. Click **"Save"** or **"Deploy"**
6. Wait for redeployment (~2 minutes)

### Step 6: Test It!

```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "date": "2025-11-15",
    "time": "14:00",
    "note": "Testing calendar integration"
  }'
```

**Expected Result:**
```json
{
  "success": true,
  "appointment": {
    "meetLink": "https://meet.google.com/abc-defg-hij",  ← Should have value!
    "calendarLink": "https://calendar.google.com/..."    ← Should have value!
  }
}
```

**Then Check:**
- ✅ Patient email receives invitation
- ✅ Doctor email receives notification
- ✅ Both see event in Google Calendar
- ✅ Google Meet link works

---

## 🎯 Quick Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google Calendar API
- [ ] Created OAuth credentials
- [ ] Got Client ID and Secret
- [ ] Got Refresh Token
- [ ] Added all 4 variables to Railway
- [ ] Railway redeployed
- [ ] Tested booking - has meetLink
- [ ] Checked patient email
- [ ] Checked doctor email
- [ ] Verified calendar events

---

## 🔍 Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution:** Add both URIs to OAuth credentials:
- `http://localhost:5000/auth/google/callback`
- `https://appointmentmangement-production.up.railway.app/auth/google/callback`

### Issue: "Invalid refresh token"
**Solution:** 
- Make sure you copied the entire token (it's long!)
- Tokens can expire - generate a new one
- Make sure you authorized with the correct Google account

### Issue: Still getting `meetLink: null`
**Solution:**
1. Check Railway logs for errors
2. Verify all 4 variables are set
3. Make sure refresh token starts with `1//`
4. Redeploy the service

### Issue: "Calendar not initialized"
**Solution:** Check server logs:
```bash
railway logs
```

Look for:
- ✅ `✅ Google Calendar integration initialized`
- ❌ `⚠️ Google Calendar integration not configured`

---

## 📧 What Emails Look Like

### Patient Receives:
```
From: doctor@yourclinic.com via Google Calendar
Subject: Invitation: Doctor Appointment...

📅 Doctor Appointment
🕐 Friday, November 15, 2025 ⋅ 2:00 – 2:30pm
🎥 Join: https://meet.google.com/abc-defg-hij

[Yes] [No] [Maybe]
```

### Doctor Receives:
```
From: Google Calendar
Subject: Appointment Created...

📅 Doctor Appointment - patient@example.com
🕐 Friday, November 15, 2025 ⋅ 2:00 – 2:30pm
👥 Guests: patient@example.com (invited)
```

---

## 🎉 Success!

Once configured, every appointment booking will:
- ✅ Create Google Calendar event
- ✅ Send email to patient
- ✅ Send email to doctor
- ✅ Generate Google Meet link
- ✅ Update both calendars
- ✅ Include reminders

**Works for:**
- Book appointment
- Reschedule appointment
- Cancel appointment

---

## 📚 Related Docs

- `GOOGLE_CALENDAR_SETUP.md` - Detailed setup
- `EMAIL_INVITATIONS_SETUP.md` - Email details
- `backend/routes/google-auth.js` - Auth endpoints

---

**Need help? Follow the steps above carefully and you'll have it working in 15 minutes!** 🚀


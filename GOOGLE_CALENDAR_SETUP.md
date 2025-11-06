# 🗓️ Google Calendar Integration Setup

This guide will help you integrate Google Calendar with your appointment management system. Every appointment will automatically create a Google Calendar event with a Google Meet link!

## ✨ Features

- ✅ Automatic calendar event creation
- ✅ Google Meet video links included
- ✅ Email invitations to patients
- ✅ Automatic reminders (24 hours & 30 minutes before)
- ✅ Updates when appointments are rescheduled
- ✅ Deletes events when appointments are cancelled

## 🚀 Setup Steps

### Step 1: Create Google Cloud Project (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it: "Appointment Management" or similar

### Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External** (for testing)
   - App name: "Appointment Management"
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Skip for now
   - Test users: Add your email
   - Click **Save and Continue**

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Appointment Backend"
   - Authorized redirect URIs: Add this URL:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Click **Create**

5. **Copy your credentials:**
   - Client ID: `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 4: Update Backend .env File

Add these lines to `/home/ilya/Desktop/appointment_mangement/backend/.env`:

```env
# Google Calendar Integration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
GOOGLE_CALENDAR_ID=primary
TIMEZONE=America/New_York
```

**Replace:**
- `your_client_id_here` with your actual Client ID
- `your_client_secret_here` with your actual Client Secret
- `TIMEZONE` with your timezone (e.g., America/Los_Angeles, Europe/London)

### Step 5: Install Google APIs Package

```bash
cd /home/ilya/Desktop/appointment_mangement/backend
npm install googleapis
```

### Step 6: Get Refresh Token (One-time)

1. **Restart your backend** if it's running:
   ```bash
   cd /home/ilya/Desktop/appointment_mangement/backend
   npm start
   ```

2. **Get the authorization URL:**
   Visit in your browser:
   ```
   http://localhost:5000/api/auth/google
   ```
   
   This will return a JSON with an `authUrl`. Copy that URL.

3. **Authorize the application:**
   - Paste the URL in your browser
   - Sign in with your Google account
   - Click **Continue** (ignore the "unverified app" warning for testing)
   - Grant calendar permissions
   - You'll be redirected to a page showing your `GOOGLE_REFRESH_TOKEN`

4. **Add the refresh token to .env:**
   ```env
   GOOGLE_REFRESH_TOKEN=your_refresh_token_here
   ```

5. **Restart the backend:**
   ```bash
   # Stop the backend (Ctrl+C) and start again
   npm start
   ```

   You should see:
   ```
   ✅ Google Calendar integration initialized
   ```

## 🎉 You're Done!

Now every time an appointment is created, it will:
1. ✅ Create a Google Calendar event
2. ✅ Add a Google Meet link
3. ✅ Send email invitation to the patient
4. ✅ Set up reminders

## 🧪 Test It

1. Go to http://localhost:3000
2. Book an appointment
3. Check your Google Calendar - you should see the event!
4. The appointment will have a Google Meet link

## 📊 What's Stored in Database

Each appointment now includes:
- `googleEventId` - Calendar event ID
- `googleEventLink` - Link to view event in Google Calendar
- `googleMeetLink` - Google Meet video call link

## 🔧 Optional: Use a Different Calendar

To use a specific calendar instead of your primary calendar:

1. Go to [Google Calendar](https://calendar.google.com)
2. Find the calendar you want to use
3. Click the three dots → **Settings and sharing**
4. Scroll to **Integrate calendar**
5. Copy the **Calendar ID** (looks like: `abcd1234@group.calendar.google.com`)
6. Update your `.env`:
   ```env
   GOOGLE_CALENDAR_ID=abcd1234@group.calendar.google.com
   ```

## 🔒 Security Notes

### For Development:
- Current setup is fine for testing
- OAuth consent screen can stay "Testing" mode

### For Production:
1. Verify your OAuth consent screen with Google
2. Use environment variables (never commit .env)
3. Consider service account for server-to-server auth
4. Add proper error handling
5. Implement token refresh logic

## 🆘 Troubleshooting

### "Google Calendar integration not configured"
- Check that all `GOOGLE_*` variables are in your `.env` file
- Make sure no extra spaces in the values
- Restart the backend server

### "Invalid credentials"
- Verify Client ID and Client Secret are correct
- Make sure you copied them completely

### "Invalid grant" error
- Your refresh token might be expired
- Re-do Step 6 to get a new refresh token

### Events not showing in calendar
- Check backend logs for errors
- Verify the calendar ID is correct
- Make sure the account has calendar access

### "Access blocked: This app's request is invalid"
- Add http://localhost:5000/api/auth/google/callback to Authorized redirect URIs
- Wait a few minutes for changes to propagate

## 📱 Frontend Display

The dashboard and appointment list will automatically show:
- Google Calendar event links
- Google Meet links (if available)

Patients can click these links to:
- View the event in their calendar
- Join the video call

## 🎯 Advanced: Webhook Notifications

To get notified when users modify calendar events:
1. Set up Cloud Pub/Sub
2. Configure Calendar API push notifications
3. Handle webhook events in your backend

## 💡 Tips

- Events are created with the doctor's calendar
- Patients receive email invitations automatically
- Reminders are set for 24 hours and 30 minutes before
- Events are automatically deleted when appointments are cancelled
- Timezone is configurable in .env

---

**Need help?** Check the troubleshooting section or review the backend logs for detailed error messages.


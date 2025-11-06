# 🔧 Fix: Access Blocked - Google Verification

## Problem
You see: "Access blocked: Voice AI Demo has not completed the Google verification process"

## Solution: Add Yourself as Test User

### Option 1: Add Test User (Recommended for Development)

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Select your project:**
   - Click the project dropdown at the top
   - Select "Appointment Management" (or your project name)

3. **Go to OAuth consent screen:**
   - Left menu → **APIs & Services** → **OAuth consent screen**

4. **Add test users:**
   - Scroll down to **"Test users"** section
   - Click **"+ ADD USERS"**
   - Enter your email address (the one you're using to sign in)
   - Click **"Save"**

5. **Try authorization again:**
   - Go back to: http://localhost:5000/api/auth/google
   - Copy the authorization URL
   - Paste in browser
   - You should now be able to proceed!

### Option 2: Click "Advanced" During Auth (Quick Workaround)

If you see the blocked screen:

1. Look for **"Advanced"** link at the bottom left
2. Click **"Advanced"**
3. Click **"Go to Voice AI Demo (unsafe)"**
4. Continue with authorization

**Note:** This works but Google may show warnings. Adding yourself as a test user (Option 1) is cleaner.

### Option 3: Simplify OAuth Consent Screen

1. **Go to OAuth consent screen**
2. Click **"EDIT APP"**
3. **Publishing status:** Make sure it's in "Testing" mode
4. **Scopes:** Only add these minimal scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
5. **Test users:** Add your email(s)
6. Click **"SAVE AND CONTINUE"**

## Complete Flow After Fix

Once you've added yourself as a test user:

1. **Get auth URL:**
   ```
   http://localhost:5000/api/auth/google
   ```

2. **Authorize:**
   - Copy the `authUrl` from the response
   - Paste in browser
   - Sign in with Google
   - Grant permissions

3. **Get refresh token:**
   - You'll be redirected to a page showing `GOOGLE_REFRESH_TOKEN`
   - Copy that token

4. **Add to .env:**
   ```env
   GOOGLE_REFRESH_TOKEN=your_refresh_token_here
   ```

5. **Restart backend:**
   ```bash
   cd /home/ilya/Desktop/appointment_mangement/backend
   # Stop backend (Ctrl+C in that terminal)
   npm start
   ```

6. **Verify:**
   You should see:
   ```
   ✅ Google Calendar integration initialized
   ```

## Why This Happens

- Google requires OAuth apps to be "verified" for public use
- In "Testing" mode, only test users can authorize
- For development/demo, adding yourself as test user is sufficient
- For production, you'd need to go through Google's verification process

## Quick Checklist

- [ ] Google Cloud project created
- [ ] Calendar API enabled
- [ ] OAuth credentials created
- [ ] Redirect URI added: `http://localhost:5000/api/auth/google/callback`
- [ ] OAuth consent screen configured
- [ ] **Your email added as test user** ← Most important!
- [ ] App in "Testing" mode
- [ ] Credentials added to .env file

## Alternative: Skip Google Calendar for Now

If you want to skip Google Calendar integration for your demo:

- The app works perfectly without it!
- Appointments are still created
- No calendar events, but all features work
- You can add it later when needed

Just leave the `GOOGLE_*` variables empty in your `.env` file and the system will work normally.

## Need Help?

If still having issues:
1. Make sure you're signed in to Google with the same email you added as test user
2. Try in an incognito/private browser window
3. Clear browser cache and cookies
4. Make sure OAuth consent screen is in "Testing" mode

---

**Quick Summary:** Add your email as a test user in Google Cloud Console → OAuth consent screen → Test users section. That's it! 🎉


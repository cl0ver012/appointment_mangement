# 🌐 How to Get Railway Backend URL - Step-by-Step UI Guide

## 📍 Finding Your Railway Endpoint URL (Visual Guide)

### Step 1: Go to Railway Dashboard

1. Open your browser
2. Go to: **https://railway.app/**
3. Click **"Login"** (top right)
4. Sign in with your GitHub account

**What you'll see:**
- Railway dashboard with your projects list

---

### Step 2: Open Your Project

1. You'll see a list of your projects
2. Look for your project (might be called "appointment-management" or similar)
3. **Click on the project card** to open it

**What you'll see:**
- Project overview with services inside

---

### Step 3: Click Your Service

1. Inside the project, you'll see one or more services
2. Look for your backend service (might be called "backend" or "appointment-backend")
3. **Click on the service**

**What you'll see:**
- Service details page opens

---

### Step 4: Find the URL (Top of Page)

**Look at the TOP of the service page.**

You'll see a section that looks like this:

```
╔═══════════════════════════════════════════════════════╗
║  [Service Icon] backend                               ║
║                                                       ║
║  🌐 Domains                                           ║
║  ┌──────────────────────────────────────────────┐    ║
║  │ https://backend-production.up.railway.app    │    ║
║  └──────────────────────────────────────────────┘    ║
║                                                       ║
║  Latest Deployment: ✓ Success                        ║
╚═══════════════════════════════════════════════════════╝
```

**That URL in the "Domains" box is your Railway endpoint!**

**Example URLs you might see:**
- `https://appointment-backend-production.up.railway.app`
- `https://backend-production-abc123.up.railway.app`
- `https://web-production-xyz456.up.railway.app`

---

### Step 5: Copy the URL

1. **Click on the URL** in the Domains section
2. It will copy to your clipboard automatically
3. OR manually select and copy (Ctrl+C / Cmd+C)

**That's your backend endpoint URL!**

---

## 🎯 Alternative Method: Through Settings Tab

If you don't see the URL on the main page:

### Step 1: Click "Settings" Tab

1. In your service page, look at the tabs at the top
2. Click **"Settings"**

**Tabs look like:**
```
[ Overview ] [ Deployments ] [ Metrics ] [ Settings ] [ ··· ]
```

---

### Step 2: Scroll to Networking Section

1. Scroll down the Settings page
2. Look for a section called **"Networking"** or **"Domains"**

---

### Step 3: Find Public Domain

In the Networking section, you'll see:

```
Public Networking
─────────────────────────────────────────────────
✓ Enabled

Public Domain:
https://backend-production.up.railway.app
                                        [Copy] [⚙️]
```

**Click "Copy" button** or select and copy the URL

---

## 🔍 If You Don't See a URL Yet

### Scenario A: Deployment Not Complete

**If deployment is still in progress:**

1. Go to **"Deployments"** tab
2. You'll see:
   ```
   Building... ⏳
   or
   Deploying... ⏳
   ```
3. **Wait** for it to show: `✓ Success`
4. **Then** the URL will appear

---

### Scenario B: Domain Not Generated

**If deployment succeeded but no URL:**

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. You might see:
   ```
   Public Networking
   ☐ Not enabled
   
   [Generate Domain] button
   ```
4. Click **"Generate Domain"**
5. Railway creates a URL for you
6. Copy the newly generated URL

---

## ✅ Verify Your URL Works

Once you have the URL, test it:

### Method 1: Browser Test

1. Copy your Railway URL
2. Add `/api/health` to the end
3. Paste in browser: `https://YOUR-URL.railway.app/api/health`
4. Press Enter

**You should see:**
```json
{
  "success": true,
  "message": "Appointment Management API is running",
  "timestamp": "2025-11-06..."
}
```

✅ **Your backend is online!**

---

### Method 2: Command Line Test

```bash
curl https://YOUR-RAILWAY-URL.railway.app/api/health
```

Should return the same JSON.

---

## 📋 What Your Railway URL Looks Like

**Common formats:**

```
Format 1: https://[project-name]-production.up.railway.app
Example:  https://appointment-backend-production.up.railway.app

Format 2: https://[service-name]-production-[random].up.railway.app  
Example:  https://backend-production-abc123.up.railway.app

Format 3: https://web-production-[random].up.railway.app
Example:  https://web-production-xyz456.up.railway.app
```

All of these are valid - Railway auto-generates them!

---

## 🎯 Once You Have the URL

### Use it for these 3 things:

**1. Update Railway Variable:**
```
Variable: GOOGLE_REDIRECT_URI
Value: https://YOUR-RAILWAY-URL/api/auth/google/callback
```

**2. Use in Vercel Frontend:**
```
Variable: REACT_APP_API_URL
Value: https://YOUR-RAILWAY-URL/api
```

**3. Share Your API:**
- Give to voice AI developers
- Use in Postman
- Share with healthcare companies

---

## 📸 Visual Reference

### What Railway Dashboard Looks Like:

```
╔═══════════════════════════════════════════════════════════════╗
║ Railway                                      [Profile] [Logout] ║
║                                                                 ║
║ ← Projects / appointment-management                             ║
║                                                                 ║
║ ┌─────────────────────────────────────────────────────────┐    ║
║ │ backend                                     [Settings] ⚙ │    ║
║ │                                                          │    ║
║ │ 🌐 Domains                                               │    ║
║ │ https://backend-production.up.railway.app    [Copy] 📋  │  ← HERE!
║ │                                                          │    ║
║ │ Latest Deployment                                        │    ║
║ │ ✓ Live                                                   │    ║
║ └─────────────────────────────────────────────────────────┘    ║
║                                                                 ║
║ [ Overview ] [ Deployments ] [ Metrics ] [ Settings ]          ║
║                                                                 ║
╚═══════════════════════════════════════════════════════════════╝
```

**The URL is at the top!** 👆

---

## 🆘 Still Can't Find It?

### Try this:

1. Go to Railway dashboard: https://railway.app/dashboard
2. Click your project name
3. Click the service inside
4. Look at the VERY TOP of the page
5. Should see "Domains" with a URL

### Or:

1. Click "Deployments" tab
2. Click the latest deployment (the one at top)
3. Scroll to the bottom of logs
4. Should show: "Deployed to: https://..."

### Still nothing?

The deployment might have failed. Check:
1. "Deployments" tab → Latest deployment
2. Look for red ✗ (failed) or yellow ⏳ (building)
3. Click on it to see error logs
4. Fix errors and redeploy

---

## ✅ Quick Summary

**Where:** Railway Dashboard → Your Service → Top of page  
**Section:** "Domains"  
**Format:** `https://something.up.railway.app`  
**What it is:** Your public backend API endpoint  
**Use for:** API calls, frontend connection, Google OAuth redirect

---

**The URL is displayed prominently at the top once deployment succeeds!** 🎉


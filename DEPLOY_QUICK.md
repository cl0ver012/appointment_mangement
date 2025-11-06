# ⚡ Quick Online Deployment (15 Minutes)

The **fastest way** to get your app online for demos.

## 🎯 Strategy

- **Backend:** Railway (Auto-deploy from GitHub)
- **Frontend:** Vercel (Auto-deploy from GitHub)  
- **Database:** MongoDB Atlas (Already configured ✅)

**Total Time:** 15 minutes  
**Cost:** Free

---

## Step 1: Push to GitHub (3 minutes)

```bash
cd /home/ilya/Desktop/appointment_mangement

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo at: https://github.com/new
# Name it: appointment-management

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/appointment-management.git
git branch -M main
git push -u origin main
```

✅ **Code is on GitHub**

---

## Step 2: Deploy Backend on Railway (5 minutes)

### A. Create Railway Account
1. Go to: **https://railway.app/**
2. Click **"Start a New Project"**
3. Sign in with **GitHub**

### B. Deploy
1. Click **"Deploy from GitHub repo"**
2. Select: **appointment-management**
3. Railway auto-detects Node.js
4. Click **"Deploy Now"**

### C. Configure Root Directory
1. Click your service
2. Go to **"Settings"**
3. Set **"Root Directory"**: `backend`
4. Click **"Save"**

### D. Add Environment Variables
1. Click **"Variables"** tab
2. Click **"New Variable"**
3. Add these one by one:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=<paste your MongoDB Atlas connection string>
GOOGLE_CLIENT_ID=<paste your client ID>
GOOGLE_CLIENT_SECRET=<paste your client secret>
GOOGLE_REFRESH_TOKEN=<paste your refresh token>
GOOGLE_CALENDAR_ID=primary
TIMEZONE=America/New_York
```

4. **Important:** Add `GOOGLE_REDIRECT_URI` after you get your Railway URL (see next step)

### E. Get Your Backend URL
1. Go to **"Settings"**
2. Under **"Domains"**, you'll see a URL like:
   ```
   https://appointment-backend-production.up.railway.app
   ```
3. **Copy this URL**

### F. Update Google Redirect URI
1. Go back to **"Variables"**
2. Add:
   ```
   GOOGLE_REDIRECT_URI=https://YOUR-RAILWAY-URL/api/auth/google/callback
   ```
3. Also update in Google Cloud Console → Credentials

### G. Test Backend
```bash
curl https://YOUR-RAILWAY-URL/api/health
```

Should return: `{"success": true}`

✅ **Backend is online!**

---

## Step 3: Deploy Frontend on Vercel (5 minutes)

### A. Create Vercel Account
1. Go to: **https://vercel.com/signup**
2. Sign up with **GitHub**

### B. Deploy
1. Click **"Add New..."** → **"Project"**
2. Click **"Import"** next to your `appointment-management` repo
3. Configure:
   - **Root Directory**: `frontend` (click "Edit" to set this)
   - **Framework Preset**: Create React App (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

### C. Add Environment Variable
1. Before deploying, expand **"Environment Variables"**
2. Add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://YOUR-RAILWAY-URL/api` (your Railway backend URL + /api)
3. Click **"Add"**

### D. Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. ✅ **Done!**

### E. Get Your Frontend URL

Vercel gives you a URL like:
```
https://appointment-management-xyz.vercel.app
```

✅ **Frontend is online!**

---

## Step 4: Update Backend CORS (2 minutes)

### Via Railway Dashboard

1. Go to Railway → Your backend service
2. Click **"Variables"**
3. Add new variable:
   ```
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```

### Or Edit Code

Edit `backend/server.js` and redeploy:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
};
app.use(cors(corsOptions));
```

---

## ✅ Verification Checklist

### Backend
- [ ] Visit: `https://YOUR-RAILWAY-URL/api/health`
- [ ] Should return: `{"success": true}`
- [ ] Test: `https://YOUR-RAILWAY-URL/api/slots?available=true`
- [ ] Should return list of slots

### Frontend
- [ ] Visit: `https://YOUR-VERCEL-URL`
- [ ] Dashboard loads
- [ ] KPIs display
- [ ] Can see appointments

### Integration
- [ ] Create appointment via Postman (use production URL)
- [ ] Check response has `googleMeetLink`
- [ ] Verify in Google Calendar
- [ ] Check dashboard updates

---

## 🎉 You're Live!

Your production URLs:

```
Frontend:     https://your-app.vercel.app
Backend API:  https://your-api.railway.app/api
Health:       https://your-api.railway.app/api/health

LLM API:      https://your-api.railway.app/api/llm
MongoDB:      Atlas (already online)
```

**Share these URLs for demos!**

---

## 💡 Tips

### Custom Domain (Optional)
- Vercel: Settings → Domains → Add domain
- Railway: Settings → Custom Domain

### Monitoring
- Railway has built-in logs
- Vercel has analytics
- Add Sentry for error tracking

### Auto-Deploy
- Both Railway and Vercel auto-deploy when you push to GitHub
- Just `git push` and your app updates!

---

## 🔄 Update Your Deployment

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Railway and Vercel auto-deploy!
# Wait 2-3 minutes for build
```

---

**Need help with deployment? Let me know which service you want to use!** 🚀


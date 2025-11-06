# ✅ Pre-Deployment Checklist

Before deploying online, make sure you have these ready.

## 📋 Required Items

### 1. GitHub Account
- [ ] Have GitHub account
- [ ] Can create repositories

### 2. MongoDB Atlas
- [x] MongoDB Atlas account created ✅
- [x] Cluster created ✅
- [x] Connection string ready ✅
- [ ] Copy connection string from `backend/.env`

**Your MongoDB URI:**
```
Check: backend/.env file for MONGODB_URI
```

### 3. Google Calendar Credentials
- [x] Google Cloud project created ✅
- [x] Calendar API enabled ✅
- [x] OAuth credentials created ✅
- [x] Refresh token obtained ✅
- [ ] Copy all Google credentials from `backend/.env`

**Your Google credentials:**
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
```

### 4. Deployment Platform Accounts

Choose one:

**Option A: Railway + Vercel (Recommended)**
- [ ] Create Railway account: https://railway.app/
- [ ] Create Vercel account: https://vercel.com/

**Option B: Render**
- [ ] Create Render account: https://render.com/

**Option C: Heroku**
- [ ] Create Heroku account: https://heroku.com/

---

## 🔧 Prepare Your Code

### 1. Test Locally First
```bash
# Make sure everything works locally
cd /home/ilya/Desktop/appointment_mangement

# Backend should be running
curl http://localhost:5000/api/health

# Frontend should be running
curl http://localhost:3000
```

✅ Both should respond successfully

### 2. Check .gitignore

Make sure `.gitignore` includes:
```
node_modules/
.env
*.log
build/
```

✅ This prevents committing secrets

### 3. Create .env.example

For documentation purposes (already created ✅)

---

## 📦 Get Ready to Deploy

### Copy These Values (You'll Need Them)

From `backend/.env`:

1. **MongoDB Connection:**
```
MONGODB_URI=mongodb+srv://...
```

2. **Google Credentials:**
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
```

**Write these down or keep the .env file open!**

---

## 🚀 Deployment Order

1. **Push to GitHub** (3 min)
2. **Deploy Backend** (5 min) - Railway/Render
3. **Deploy Frontend** (5 min) - Vercel/Netlify
4. **Test Everything** (2 min)

**Total: 15 minutes**

---

## ✅ Ready to Deploy?

If you checked all boxes above, you're ready!

**Next steps:**

1. **Quick deployment:**
```bash
cat DEPLOY_QUICK.md
```

2. **Interactive helper:**
```bash
bash deploy-railway.sh
```

3. **Complete guide:**
```bash
cat DEPLOY_ONLINE.md
```

---

## 🆘 Missing Something?

### Don't have MongoDB Atlas?
→ Follow: `MONGODB_ATLAS_SETUP.md`

### Don't have Google Calendar setup?
→ Optional! App works without it
→ Or follow: `GOOGLE_CALENDAR_SETUP.md`

### Don't have GitHub account?
→ Create one at: https://github.com/signup

---

**Once you have everything, deployment takes only 15 minutes!** 🚀


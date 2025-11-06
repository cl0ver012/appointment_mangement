# 🌐 MongoDB Atlas Setup Guide

MongoDB Atlas is a free cloud-hosted MongoDB database - perfect for this project!

## Step 1: Create a MongoDB Atlas Account (2 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email or Google account
3. Click "Create an account"

## Step 2: Create a Free Cluster (1 minute)

1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose **"M0 FREE"** (the free tier)
3. Select a cloud provider and region:
   - **Provider**: AWS, Google Cloud, or Azure (doesn't matter)
   - **Region**: Choose one closest to you for better speed
4. **Cluster Name**: Leave default or name it `AppointmentCluster`
5. Click **"Create Cluster"** (takes 1-3 minutes to provision)

## Step 3: Create Database User (1 minute)

While the cluster is being created:

1. You'll see a **"Security Quickstart"** screen
2. Under **"How would you like to authenticate your connection?"**
   - Choose **"Username and Password"**
   - Username: `admin` (or your choice)
   - Password: Click **"Autogenerate Secure Password"** (SAVE THIS!)
   - Or create your own password (remember it!)
3. Click **"Create User"**

**⚠️ IMPORTANT: Save your password! You'll need it in Step 5.**

## Step 4: Configure Network Access (30 seconds)

1. Under **"Where would you like to connect from?"**
2. Choose **"My Local Environment"**
3. Click **"Add My Current IP Address"**
   - Or for development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is fine for development, but restrict it in production
4. Click **"Finish and Close"**

## Step 5: Get Your Connection String (1 minute)

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select:
   - **Driver**: Node.js
   - **Version**: 4.1 or later
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Replace `<password>`** with your actual password from Step 3

**Your final connection string should look like:**
```
mongodb+srv://admin:yourActualPassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Update Your Project (30 seconds)

1. Open the file: `/home/ilya/Desktop/appointment_mangement/backend/.env`

2. Replace the MongoDB URI with your Atlas connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://admin:yourPassword@cluster0.xxxxx.mongodb.net/appointment_management?retryWrites=true&w=majority
   NODE_ENV=development
   ```

   **⚠️ IMPORTANT:** Add `/appointment_management` before the `?` to specify the database name!

3. Save the file

## Step 7: Start the Backend (10 seconds)

```bash
cd /home/ilya/Desktop/appointment_mangement/backend
npm start
```

**You should see:**
```
Server is running on port 5000
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

✅ **Success!** Your backend is now connected to MongoDB Atlas!

## Step 8: Add Sample Data (Optional)

```bash
cd /home/ilya/Desktop/appointment_mangement/backend
node init-sample-data.js
```

## 🎉 You're All Set!

Now your application is using MongoDB Atlas:
- ✅ No local MongoDB installation needed
- ✅ Free tier (512 MB storage)
- ✅ Automatic backups
- ✅ Access from anywhere
- ✅ Professional cloud hosting

## 📊 View Your Data

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"** on your cluster
3. Select **"appointment_management"** database
4. You'll see your collections:
   - `appointments` - All booked appointments
   - `availableslots` - All time slots

## 🔒 Security Best Practices

### For Development:
- ✅ Current setup is fine

### For Production:
1. **Whitelist specific IPs** instead of 0.0.0.0/0
2. **Use environment variables** (never commit .env to git)
3. **Use strong passwords** with special characters
4. **Enable additional security features** in Atlas

## 🆘 Troubleshooting

### "Authentication failed"
- Check your username and password
- Make sure you replaced `<password>` in the connection string
- Password cannot contain special characters like @, :, / without URL encoding

### "IP not whitelisted"
- Go to Network Access in Atlas
- Add your current IP or use 0.0.0.0/0 for development

### "Could not connect to any servers"
- Check your internet connection
- Verify the connection string is correct
- Make sure cluster is running (not paused)

### Connection string has special characters in password
If your password has special characters, URL-encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`

Or regenerate a password without special characters.

## 💡 Atlas Free Tier Limits

- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent
- **Backups**: None (upgrade for backups)

**More than enough for this project!**

## 🚀 Quick Reference

**Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://admin:myPassword123@cluster0.abc123.mongodb.net/appointment_management?retryWrites=true&w=majority
```

---

**Need help?** MongoDB Atlas has great documentation: https://docs.atlas.mongodb.com/


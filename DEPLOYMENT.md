# 🚀 Deployment Guide

This guide covers deploying the Appointment Management Platform to production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Deployment Platforms](#deployment-platforms)
- [Security Considerations](#security-considerations)

## Prerequisites

- Production MongoDB instance
- Node.js hosting platform (for backend)
- Static hosting platform (for frontend)
- Domain name (optional but recommended)
- SSL certificate (recommended)

## Backend Deployment

### Option 1: Using PM2 (Recommended for VPS)

1. **Install PM2**:
```bash
npm install -g pm2
```

2. **Navigate to backend directory**:
```bash
cd /path/to/appointment_mangement/backend
```

3. **Install production dependencies**:
```bash
npm install --production
```

4. **Set environment variables**:
```bash
export NODE_ENV=production
export PORT=5000
export MONGODB_URI=your_production_mongodb_uri
```

5. **Start with PM2**:
```bash
pm2 start server.js --name appointment-backend
pm2 save
pm2 startup
```

6. **Monitor**:
```bash
pm2 status
pm2 logs appointment-backend
```

### Option 2: Docker

1. **Create Dockerfile** (backend/Dockerfile):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

2. **Build and run**:
```bash
docker build -t appointment-backend .
docker run -d -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e NODE_ENV=production \
  --name appointment-backend \
  appointment-backend
```

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**:
```bash
cd backend
heroku create your-app-name
```

3. **Set environment variables**:
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
```

4. **Deploy**:
```bash
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Option 4: AWS EC2

1. **Launch EC2 instance** (Ubuntu 22.04 recommended)
2. **SSH into instance**
3. **Install Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Clone and setup**:
```bash
git clone your-repo
cd appointment_mangement/backend
npm install --production
```

5. **Use PM2** (see Option 1)

6. **Configure Nginx** (optional, for reverse proxy):
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Frontend Deployment

### Build for Production

1. **Navigate to frontend directory**:
```bash
cd /path/to/appointment_mangement/frontend
```

2. **Set API URL**:
```bash
export REACT_APP_API_URL=https://api.yourdomain.com/api
```

3. **Build**:
```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Option 1: Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Deploy**:
```bash
cd frontend
netlify deploy --prod --dir=build
```

3. **Configure environment variables** in Netlify dashboard:
   - `REACT_APP_API_URL` = your backend API URL

### Option 2: Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel --prod
```

3. **Set environment variables** in Vercel dashboard

### Option 3: AWS S3 + CloudFront

1. **Create S3 bucket**
2. **Enable static website hosting**
3. **Upload build files**:
```bash
aws s3 sync build/ s3://your-bucket-name
```

4. **Create CloudFront distribution** pointing to S3
5. **Configure custom domain** (optional)

### Option 4: Nginx (on VPS)

1. **Copy build files**:
```bash
sudo cp -r build/* /var/www/appointment-frontend/
```

2. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/appointment-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Enable site**:
```bash
sudo ln -s /etc/nginx/sites-available/appointment /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create account** at mongodb.com/cloud/atlas
2. **Create cluster**
3. **Configure network access** (whitelist IPs or allow all)
4. **Create database user**
5. **Get connection string**:
```
mongodb+srv://username:password@cluster.mongodb.net/appointment_management
```

### Option 2: Self-hosted MongoDB

1. **Install MongoDB** on server
2. **Configure for production**:
```bash
sudo systemctl enable mongod
sudo systemctl start mongod
```

3. **Create database and user**:
```javascript
use appointment_management
db.createUser({
  user: "app_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

4. **Enable authentication** in `/etc/mongod.conf`:
```yaml
security:
  authorization: enabled
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/appointment_management
```

### Frontend
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Security Considerations

### 1. Enable HTTPS

Use Let's Encrypt for free SSL:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 2. Configure CORS

Update backend `server.js`:
```javascript
const corsOptions = {
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

### 3. Add Rate Limiting

Install and configure:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Add Helmet for Security Headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 5. Environment Variables Security

- Never commit `.env` files
- Use secrets management (AWS Secrets Manager, Azure Key Vault)
- Rotate credentials regularly

### 6. Database Security

- Use strong passwords
- Enable authentication
- Restrict network access
- Regular backups
- Enable audit logging

### 7. Input Validation

Already implemented with `express-validator`

### 8. Authentication (Future Enhancement)

Consider adding:
- JWT tokens
- OAuth 2.0
- Role-based access control

## Monitoring

### Backend Monitoring

**PM2 Monitoring**:
```bash
pm2 monitor
```

**Custom Logging**:
```javascript
// Add to server.js
const morgan = require('morgan');
app.use(morgan('combined'));
```

### Application Monitoring Services

- New Relic
- Datadog
- Application Insights (Azure)
- CloudWatch (AWS)

## Backup Strategy

### Database Backups

**MongoDB Atlas**: Automatic backups enabled

**Self-hosted**:
```bash
# Daily backup script
mongodump --uri="mongodb://localhost/appointment_management" \
  --out=/backups/$(date +%Y%m%d)

# Backup retention (keep 7 days)
find /backups -type d -mtime +7 -exec rm -rf {} +
```

### Setup Cron Job:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Nginx, HAProxy, or cloud-based
2. **Multiple Backend Instances**: Run multiple instances of backend
3. **Database Replication**: MongoDB replica sets

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database indexes
- Enable query caching

## Health Checks

### Backend Health Check
Already implemented at `/api/health`

### Uptime Monitoring
Use services like:
- UptimeRobot
- Pingdom
- StatusCake

## CI/CD Pipeline

### Example GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app/backend
            git pull
            npm install --production
            pm2 restart appointment-backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy build folder to hosting service
```

## Rollback Strategy

### PM2
```bash
# If deployment fails, rollback
git checkout previous-commit
npm install
pm2 restart appointment-backend
```

### Keep Previous Builds
```bash
# Before deployment
cp -r /var/www/appointment-frontend /var/www/appointment-frontend.backup

# Rollback if needed
rm -rf /var/www/appointment-frontend
mv /var/www/appointment-frontend.backup /var/www/appointment-frontend
```

## Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] Database connection works
- [ ] API endpoints respond correctly
- [ ] HTTPS is enabled
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Monitoring is active
- [ ] Backups are scheduled
- [ ] Error logging is working
- [ ] Performance is acceptable

## Troubleshooting

### Backend Issues
```bash
# Check logs
pm2 logs appointment-backend

# Check if running
pm2 status

# Restart
pm2 restart appointment-backend
```

### Frontend Issues
- Clear browser cache
- Check API URL in build
- Verify CORS configuration
- Check browser console for errors

### Database Issues
- Verify connection string
- Check network access
- Verify credentials
- Check MongoDB logs

---

**For production support, ensure you have proper monitoring and alerting in place!**


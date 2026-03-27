# Configuration Guide

Complete reference for configuring ProSync through environment variables and settings.

---

## 📋 Overview

ProSync uses environment variables for configuration. There are two `.env` files:
- **Backend** (`backend/.env`) - Server and database configuration
- **Frontend** (`frontend/.env.local`) - Client-side configuration

---

## 🔧 Backend Configuration

### Environment File Location
```
backend/.env
```

### Complete Configuration Reference

```env
#==========================================
# SERVER CONFIGURATION
#==========================================

# Environment mode: development, production, test
NODE_ENV=development

# Server port (default: 8080)
# If port is in use, try 5000, 5001, 3001, etc.
PORT=8080

#==========================================
# DATABASE CONFIGURATION
#==========================================

# MongoDB connection string
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/prosync

# MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prosync?retryWrites=true&w=majority

# Database connection options (optional)
MONGODB_OPTIONS=retryWrites=true&w=majority

#==========================================
# JWT AUTHENTICATION
#==========================================

# Secret key for signing JWT tokens
# IMPORTANT: Use a strong, random string in production!
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Token expiration time
# Examples: 7d (7 days), 24h (24 hours), 60m (60 minutes)
JWT_EXPIRES_IN=7d

# Cookie settings
JWT_COOKIE_EXPIRES_IN=7

#==========================================
# CORS CONFIGURATION
#==========================================

# Frontend URL for CORS
# Development
FRONTEND_URL=http://localhost:3000

# Production (multiple domains separated by commas)
# FRONTEND_URL=https://app.prosync.com,https://prosync.com

#==========================================
# SECURITY
#==========================================

# Bcrypt salt rounds (10-12 recommended)
BCRYPT_SALT_ROUNDS=12

# Rate limiting
# Maximum requests per window
RATE_LIMIT_MAX=100

# Time window in milliseconds (15 minutes = 900000)
RATE_LIMIT_WINDOW_MS=900000

#==========================================
# FILE UPLOAD (Optional)
#==========================================

# Maximum file size in bytes (10MB = 10485760)
MAX_FILE_SIZE=10485760

# Upload directory
UPLOAD_DIR=uploads

# Allowed file types (comma-separated)
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,application/msword

#==========================================
# EMAIL (Optional - for notifications)
#==========================================

# SMTP Configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-specific-password
# SMTP_FROM=ProSync <noreply@prosync.com>

#==========================================
# LOGGING
#==========================================

# Log level: error, warn, info, debug
LOG_LEVEL=info

# Log directory
LOG_DIR=logs

#==========================================
# EXTERNAL SERVICES (Optional)
#==========================================

# AWS S3 (for file storage)
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_S3_BUCKET=prosync-uploads
# AWS_REGION=us-east-1

# Redis (for caching/sessions)
# REDIS_URL=redis://localhost:6379
# REDIS_PASSWORD=your-redis-password

# Sentry (for error tracking)
# SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 🎨 Frontend Configuration

### Environment File Location
```
frontend/.env.local
```

### Complete Configuration Reference

```env
#==========================================
# API CONFIGURATION
#==========================================

# Backend API URL
# IMPORTANT: Must start with NEXT_PUBLIC_ to be accessible in browser
# Development
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Production
# NEXT_PUBLIC_API_URL=https://api.prosync.com/api

#==========================================
# NEXT.JS CONFIGURATION
#==========================================

# Next.js environment
# NEXT_PUBLIC_ENV=development

# App URL
# NEXT_PUBLIC_APP_URL=http://localhost:3000

#==========================================
# OPTIONAL FEATURES
#==========================================

# Enable analytics
# NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Google Analytics ID
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Enable feature flags
# NEXT_PUBLIC_ENABLE_COMMENTS=true
# NEXT_PUBLIC_ENABLE_FILE_UPLOAD=true
```

---

## 🔒 Security Best Practices

### JWT_SECRET

⚠️ **Critical**: Never use default values in production!

#### Generate Secure Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64

# Using Python
python -c "import secrets; print(secrets.token_hex(64))"
```

#### Example Output
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Environment-Specific Values

#### Development
```env
NODE_ENV=development
JWT_SECRET=dev-secret-key-not-for-production
MONGODB_URI=mongodb://localhost:27017/prosync_dev
FRONTEND_URL=http://localhost:3000
```

#### Production
```env
NODE_ENV=production
JWT_SECRET=<generated-secure-key>
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prosync_prod
FRONTEND_URL=https://app.prosync.com
```

#### Test
```env
NODE_ENV=test
JWT_SECRET=test-secret-key
MONGODB_URI=mongodb://localhost:27017/prosync_test
FRONTEND_URL=http://localhost:3000
```

---

## 🗄️ Database Configuration

### Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/prosync
```

### MongoDB Atlas (Cloud)

1. **Create Cluster** on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Database User**:
   - Username: `prosync_user`
   - Password: Generate strong password
3. **Whitelist IP**: Add `0.0.0.0/0` (development) or specific IPs (production)
4. **Get Connection String**: Click "Connect" → "Connect your application"
5. **Update .env**:

```env
MONGODB_URI=mongodb+srv://prosync_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prosync?retryWrites=true&w=majority
```

### MongoDB with Authentication

```env
MONGODB_URI=mongodb://username:password@localhost:27017/prosync?authSource=admin
```

---

## 🌐 CORS Configuration

### Single Origin (Development)
```env
FRONTEND_URL=http://localhost:3000
```

### Multiple Origins (Production)
```env
FRONTEND_URL=https://app.prosync.com,https://prosync.com,https://www.prosync.com
```

### Custom Domains
```env
FRONTEND_URL=https://client-portal.yourdomain.com
```

---

## 📧 Email Configuration (Optional)

### Gmail SMTP

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=ProSync <noreply@prosync.com>
```

**Note**: For Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833)

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=ProSync <noreply@prosync.com>
```

### AWS SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=ProSync <noreply@yourdomain.com>
```

---

## 🔧 Port Configuration

### Default Ports
- Backend: `8080`
- Frontend: `3000`
- MongoDB: `27017`

### Custom Ports

If defaults are in use:

```env
# Backend
PORT=5001

# Frontend (in package.json)
# "dev": "next dev -p 3001"
```

---

## 📦 File Upload Configuration

### Local Storage

```env
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

### AWS S3

```env
USE_S3=true
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET=prosync-uploads
AWS_REGION=us-east-1
```

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to secure random string
- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB URI
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure rate limiting
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Back up environment files securely
- [ ] Use environment variable management service (AWS Secrets Manager, etc.)

---

## 🐛 Troubleshooting

### Issue: Environment Variables Not Loading

**Solution**:
```bash
# Check .env file exists
ls -la backend/.env

# Verify syntax (no spaces around =)
# ✅ Correct: JWT_SECRET=my-secret
# ❌ Wrong: JWT_SECRET = my-secret

# Restart server after changes
```

### Issue: MongoDB Connection Fails

**Solution**:
```bash
# Check MongoDB is running
brew services list | grep mongodb

# Test connection
mongosh mongodb://localhost:27017/prosync

# Verify URI format (no extra spaces)
```

### Issue: Frontend Can't Reach Backend

**Solution**:
```env
# Ensure API URL matches backend port
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Restart frontend dev server
npm run dev
```

---

## 📚 Related Documentation

- [Installation Guide](installation.md)
- [Production Deployment](../deployment/production-deployment.md)
- [Environment Variables Reference](../deployment/environment-variables.md)

---

## 📞 Need Help?

- Check [Installation Guide](installation.md) for setup issues
- See [Deployment Guide](../deployment/production-deployment.md) for production
- Contact: support@prosync.com

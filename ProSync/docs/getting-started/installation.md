# Installation Guide

This guide will walk you through setting up ProSync on your local machine.

---

## 📋 Prerequisites

Before installing ProSync, ensure you have:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **MongoDB** >= 6.0 ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/downloads))

### Verify Prerequisites

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: 9.x.x or higher

# Check MongoDB installation (if local)
mongod --version
# Should output: db version v6.x.x or higher
```

---

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ProSync
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your configuration
# Use your preferred editor (nano, vim, vscode, etc.)
nano .env
```

**Backend `.env` Configuration:**

```env
# Server Configuration
NODE_ENV=development
PORT=8080

# Database
MONGODB_URI=mongodb://localhost:27017/prosync
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prosync

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Optional: File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

⚠️ **Important**: Change `JWT_SECRET` to a secure random string in production!

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Edit .env.local
nano .env.local
```

**Frontend `.env.local` Configuration:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Database Setup

#### Option A: Local MongoDB

```bash
# Start MongoDB service
# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# MongoDB should start automatically, or use:
net start MongoDB
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Update `MONGODB_URI` in backend `.env`

### 5. Seed Sample Data

```bash
# From backend directory
cd backend
npm run seed
```

This creates three sample users:
- **Admin**: `admin@prosync.com` / `Admin123`
- **Project Manager**: `pm@prosync.com` / `Manager123`
- **Client**: `client@prosync.com` / `Client123`

---

## ▶️ Running ProSync

### Start Backend Server

```bash
# From backend directory
cd backend

# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

Backend will run on: `http://localhost:8080`

### Start Frontend Application

```bash
# From frontend directory (in a new terminal)
cd frontend

# Development mode
npm run dev

# Production build
npm run build
npm start
```

Frontend will run on: `http://localhost:3000`

---

## ✅ Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "success": true,
  "message": "ProSync API is running",
  "timestamp": "2026-01-13T16:24:12.420Z"
}
```

### 2. Check Frontend

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the ProSync login page.

### 3. Test Login

Try logging in with one of the seeded accounts:
- Email: `pm@prosync.com`
- Password: `Manager123`

---

## 🐛 Troubleshooting

### Backend won't start

**Issue**: Port already in use
```
Error: listen EADDRINUSE: address already in use :::8080
```

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080
# Or on Windows:
netstat -ano | findstr :8080

# Kill the process
kill -9 <PID>
# Or on Windows:
taskkill /PID <PID> /F

# Or change PORT in backend/.env
```

### Database connection fails

**Issue**:
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:
1. Ensure MongoDB is running: `brew services start mongodb-community` (macOS)
2. Check MongoDB status: `brew services list` (macOS)
3. Verify connection string in `.env`

### Frontend API calls fail

**Issue**: CORS errors or 404 on API calls

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
2. Ensure backend is running on port 8080
3. Clear browser cache and restart frontend

### Module not found errors

**Issue**:
```
Error: Cannot find module 'express'
```

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Optional: Using Docker

### Docker Compose Setup

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=prosync

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/prosync
      - JWT_SECRET=your-secret-key
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Run with:
```bash
docker-compose up -d
```

---

## 🎓 Next Steps

1. ✅ Installation complete!
2. 📖 Follow the [Quick Start Guide](quick-start.md)
3. 👥 Read your role-specific guide:
   - [Admin Guide](../user-guides/admin-guide.md)
   - [Project Manager Guide](../user-guides/project-manager-guide.md)
   - [Client Guide](../user-guides/client-guide.md)

---

## 📞 Need Help?

- Check [Common Issues](#troubleshooting)
- Read the [Configuration Guide](configuration.md)
- Open an issue on GitHub
- Contact: support@prosync.com

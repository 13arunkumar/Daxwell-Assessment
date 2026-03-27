# ProSync Backend API

Professional-grade Node.js/Express backend with MongoDB for ProSync project management portal.

## 📚 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Middleware](#middleware)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)

## 🎯 Overview

RESTful API built with:
- **Express.js** - Web framework
- **MongoDB** with Mongoose - Database
- **JWT** - Authentication
- **Zod** - Input validation
- **Bcrypt** - Password hashing

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend root:

```env
# Server
NODE_ENV=development
PORT=8080

# Database
MONGODB_URI=mongodb://localhost:27017/prosync

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # 100 requests per window

# File Upload
MAX_FILE_SIZE=10485760           # 10MB
UPLOAD_DIR=uploads
```

### MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify connection
mongosh
```

**MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

Example Atlas connection:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prosync
```

## 🛣 API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| POST | `/logout` | Private | Logout user |
| GET | `/me` | Private | Get current user |
| PUT | `/profile` | Private | Update profile |

### Project Routes (`/api/projects`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get all projects |
| GET | `/:id` | Private | Get project by ID |
| POST | `/` | Admin/PM | Create project |
| PUT | `/:id` | Admin/PM | Update project |
| DELETE | `/:id` | Admin | Delete project |
| PUT | `/:id/progress` | Admin/PM | Update progress |

### Milestone Routes (`/api/milestones`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin/PM | Create milestone |
| GET | `/project/:projectId` | Private | Get project milestones |
| PUT | `/:id` | Admin/PM | Update milestone |
| POST | `/:id/approve` | Client | Approve milestone |
| POST | `/:id/reject` | Client | Reject milestone |
| POST | `/:id/deliverables` | Admin/PM | Add deliverable |

### Task Routes (`/api/tasks`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin/PM | Create task |
| GET | `/project/:projectId` | Private | Get project tasks |
| GET | `/:id` | Private | Get task by ID |
| PUT | `/:id` | Admin/PM | Update task |
| DELETE | `/:id` | Admin/PM | Delete task |
| POST | `/:id/comments` | Private | Add comment |

### Notification Routes (`/api/notifications`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get all notifications |
| PUT | `/read-all` | Private | Mark all as read |
| PUT | `/:id/read` | Private | Mark as read |
| DELETE | `/:id` | Private | Delete notification |

## 📊 Database Schema

### User Model
```javascript
{
  name: String,           // Required, 2-100 chars
  email: String,          // Required, unique, lowercase
  password: String,       // Required, 8+ chars, hashed
  role: String,          // 'admin' | 'project_manager' | 'client'
  avatar: String,        // Optional URL
  phone: String,         // Optional
  companyId: ObjectId,   // Reference to Company
  isActive: Boolean,     // Default: true
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  title: String,                 // Required, 3-200 chars
  description: String,           // Required, max 2000 chars
  status: String,               // 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  clientId: ObjectId,           // Required, reference to User
  projectManagerId: ObjectId,   // Required, reference to User
  targetLaunchDate: Date,       // Required
  actualLaunchDate: Date,       // Optional
  totalProgress: Number,        // 0-100
  budget: Number,               // Optional
  tags: [String],              // Optional
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  isArchived: Boolean,          // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

### Milestone Model
```javascript
{
  title: String,                    // Required
  description: String,              // Optional
  projectId: ObjectId,             // Required, reference to Project
  status: String,                  // 'pending' | 'in_progress' | 'review' | 'client_approved' | 'rejected'
  dueDate: Date,                   // Required
  completedAt: Date,               // Optional
  order: Number,                   // Display order
  deliverables: [{
    name: String,
    url: String,
    type: String,                 // 'file' | 'link' | 'figma' | 'staging'
    uploadedAt: Date,
    uploadedBy: ObjectId
  }],
  approvalDetails: {
    approvedBy: ObjectId,
    approvedAt: Date,
    rejectionReason: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,                // Required
  description: String,          // Optional
  projectId: ObjectId,         // Required, reference to Project
  milestoneId: ObjectId,       // Optional, reference to Milestone
  status: String,              // 'backlog' | 'in_progress' | 'review' | 'done'
  priority: String,            // 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: ObjectId,        // Optional, reference to User
  dueDate: Date,               // Optional
  completedAt: Date,           // Optional
  estimatedHours: Number,      // Optional
  actualHours: Number,         // Optional
  comments: [{
    userId: ObjectId,
    content: String,
    createdAt: Date
  }],
  attachments: [{
    name: String,
    url: String,
    uploadedAt: Date
  }],
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Middleware

### Authentication (`authenticate`)
Validates JWT token from cookies and attaches user to request.

```javascript
// Usage
router.get('/protected', authenticate, controller)
```

### Authorization (`authorize`)
Checks if user has required role.

```javascript
// Usage
router.post('/admin-only', authenticate, authorize('admin'), controller)
router.post('/admin-pm', authenticate, authorize('admin', 'project_manager'), controller)
```

### Validation (`validate`)
Validates request data using Zod schemas.

```javascript
// Usage
router.post('/register', validate(registerSchema), controller)
```

### Error Handler
Global error handler catches all errors and formats response.

```javascript
// Handles:
- ValidationError (400)
- DuplicateKeyError (400)
- CastError (400)
- JWTError (401)
- Generic errors (500)
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```
backend/
├── __tests__/
│   ├── unit/
│   │   ├── models/
│   │   ├── utils/
│   │   └── validators/
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── projects.test.js
│   │   └── tasks.test.js
│   └── e2e/
│       └── workflow.test.js
```

### Example Integration Test

```javascript
const request = require('supertest');
const app = require('../src/server');

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'SecurePass123'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('john@example.com');
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'duplicate@example.com',
          password: 'SecurePass123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'duplicate@example.com',
          password: 'SecurePass456'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });
});
```

## 🔐 Security

### Password Security
- Minimum 8 characters
- Must contain: uppercase, lowercase, number
- Hashed with bcrypt (12 salt rounds)
- Passwords never returned in responses

### JWT Security
- Stored in HttpOnly cookies
- SameSite: strict
- Secure flag in production
- 7-day expiration

### API Security
- Rate limiting: 100 requests per 15 minutes
- Helmet for security headers
- CORS enabled for frontend only
- Input validation on all endpoints
- MongoDB injection prevention

### Example Secure Endpoint

```javascript
router.post('/projects',
  authenticate,                    // Validate JWT
  authorize('admin', 'project_manager'), // Check role
  validate(createProjectSchema),   // Validate input
  createProject                    // Execute logic
);
```

## 📈 Performance

### Optimizations
- Database indexing on frequently queried fields
- Connection pooling (max 10 connections)
- Compression middleware
- Lean queries for read operations

### Monitoring
```javascript
// Morgan logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Configure MongoDB Atlas
- [ ] Set up environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up monitoring (PM2, New Relic, etc.)
- [ ] Enable logging
- [ ] Run security audit: `npm audit`
- [ ] Set up automated backups

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name prosync-api

# Monitor
pm2 monit

# View logs
pm2 logs prosync-api

# Auto-restart on file changes
pm2 start src/server.js --watch
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

```bash
# Build
docker build -t prosync-api .

# Run
docker run -p 5000:5000 --env-file .env prosync-api
```

## 🐛 Debugging

### Common Issues

**MongoDB Connection Failed**
```bash
# Check if MongoDB is running
brew services list

# Start MongoDB
brew services start mongodb-community
```

**Port Already in Use**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill process
kill -9 <PID>
```

**JWT Verification Failed**
- Ensure `JWT_SECRET` matches between sessions
- Check cookie settings in browser

## 📞 Support

For backend-specific issues, check:
- Server logs: `npm run dev`
- MongoDB logs: `mongosh`
- Error responses in API

---

**Version**: 1.0.0
**Node Version**: >= 18.0.0
**Last Updated**: January 2026

# ProSync Portal

A comprehensive, professional-grade client-facing project management portal designed for service-based businesses (agencies, freelancers). ProSync solves the communication gap where clients feel disconnected from the development process by centralizing task tracking, file approvals, and real-time communication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [📚 Documentation](#documentation)
- [User Roles](#user-roles)
- [Architecture](#architecture)
- [Security](#security)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

### Core Features
- **Secure Authentication** - JWT-based authentication with HttpOnly cookies
- **Role-Based Access Control** - Admin, Project Manager, and Client roles
- **Project Management** - Create, track, and manage multiple projects
- **Milestone Tracking** - Break projects into manageable milestones
- **Client Approval Workflow** - One-click approval/rejection with feedback
- **Task Management** - Kanban-style task board with status tracking
- **Real-time Comments** - Contextual discussions on tasks and milestones
- **Notifications** - In-app notification system for important updates
- **File Management** - Upload and share deliverables securely
- **Progress Tracking** - Automated progress calculation

### Business Logic Highlights
- **Client Sign-off System** - Clients can approve or request revisions on milestones
- **Automated Status Updates** - Tasks automatically move based on approval workflows
- **Role-based Visibility** - Users only see projects they're involved in

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing (12 salt rounds)
- **Zod** for request validation
- **Helmet** for security headers
- **Express Rate Limit** for API protection

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **Zustand** for state management
- **Axios** for API calls
- **Lucide React** for icons

## 📁 Project Structure

```
ProSync/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   ├── validators/     # Zod schemas
│   │   └── server.js       # Entry point
│   ├── uploads/            # File storage
│   ├── package.json
│   └── README.md           # Backend documentation
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js pages (App Router)
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and API client
│   │   └── store/         # Zustand stores
│   ├── package.json
│   └── README.md          # Frontend documentation
│
└── README.md              # This file
```

## 📚 Documentation

**Complete documentation is available in the [`/docs`](docs/) directory.**

### Quick Links
- 🚀 **[Getting Started](docs/getting-started/installation.md)** - Installation and setup
- ⚡ **[Quick Start Guide](docs/getting-started/quick-start.md)** - Get running in 5 minutes
- 👥 **User Guides**: [Admin](docs/user-guides/admin-guide.md) | [PM](docs/user-guides/project-manager-guide.md) | [Client](docs/user-guides/client-guide.md)
- 📋 **[Project Lifecycle](docs/workflows/project-lifecycle.md)** - Complete workflow
- 🔐 **[API Reference](docs/api/)** - REST API documentation
- 📖 **[Documentation Index](docs/DOCUMENTATION_INDEX.md)** - Full documentation catalog

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ProSync
```

2. **Backend Setup**
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prosync
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### First Run

1. Start MongoDB
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Open browser: `http://localhost:3000`
5. Register a new account (first user becomes admin)

### 🔐 Password Requirements

When registering a new account, passwords must meet the following criteria:
- **Minimum 8 characters**
- **At least one uppercase letter** (A-Z)
- **At least one lowercase letter** (a-z)
- **At least one number** (0-9)

**Example valid passwords:**
- `Welcome123`
- `MyPassword1`
- `ProSync2024`

The registration form provides real-time feedback to help you create a valid password.

## 👥 User Roles

### Admin
- Full system access
- Manage all projects
- Invite employees
- View financial summaries

### Project Manager (PM)
- Create and manage projects
- Upload deliverables
- Assign tasks
- Manage assigned client accounts

### Client
- View assigned project progress
- Approve/reject milestones
- Comment on tasks
- View notifications

## 🏗 Architecture

### Backend Architecture
```
Request → Rate Limiter → Router → Validator → Auth → Controller → Model → Database
                                                    ↓
                                              Error Handler
```

### Security Layers
1. **Helmet** - Security headers
2. **Rate Limiting** - 100 requests per 15 minutes
3. **JWT Validation** - HttpOnly cookies
4. **Input Validation** - Zod schemas
5. **Password Hashing** - Bcrypt (12 rounds)
6. **Role-Based Access** - Middleware authorization

### Frontend Architecture
```
Page → Layout → Auth Check → API Call → Zustand Store → UI Component
```

## 🔒 Security

### Password Security
- Minimum 8 characters
- Must contain uppercase, lowercase, and number
- Hashed with bcrypt (12 salt rounds)
- Never stored in plain text

### Authentication
- JWT tokens stored in HttpOnly cookies
- Automatic token refresh
- CSRF protection with SameSite cookies
- Secure flag enabled in production

### API Security
- Rate limiting on all endpoints
- Input validation with Zod
- SQL injection prevention (MongoDB + Mongoose)
- XSS protection via Helmet
- CORS configuration

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Test Structure
```
backend/
├── __tests__/
│   ├── unit/          # Unit tests
│   ├── integration/   # API tests
│   └── e2e/          # End-to-end tests
```

### Example Test (Jest + Supertest)
```javascript
describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Password123' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
  });
});
```

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Profile
```http
GET /auth/me
Cookie: token=<jwt-token>
```

### Project Endpoints

#### Get All Projects
```http
GET /projects
Cookie: token=<jwt-token>
```

#### Get Project by ID
```http
GET /projects/:id
Cookie: token=<jwt-token>
```

#### Create Project (Admin/PM only)
```http
POST /projects
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "title": "Website Redesign",
  "description": "Complete redesign of company website",
  "clientId": "507f1f77bcf86cd799439011",
  "projectManagerId": "507f1f77bcf86cd799439012",
  "targetLaunchDate": "2024-12-31T00:00:00.000Z"
}
```

### Milestone Endpoints

#### Approve Milestone (Client only)
```http
POST /milestones/:id/approve
Cookie: token=<jwt-token>
```

#### Reject Milestone (Client only)
```http
POST /milestones/:id/reject
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "reason": "The design doesn't match our brand guidelines"
}
```

For complete API documentation, see [backend/README.md](backend/README.md)

## 📊 Success Metrics

- **System Uptime**: 99.9%
- **Security**: Zero high-risk vulnerabilities
- **Performance**: Lighthouse score 90+ for Performance and Accessibility
- **Code Quality**: 70%+ test coverage

## 🤝 Contributing

### Code Quality Standards
1. **ESLint** - All code must pass linting
2. **Prettier** - Consistent code formatting
3. **Type Safety** - TypeScript for frontend
4. **Testing** - Minimum 70% coverage
5. **Documentation** - All APIs must be documented

### Pull Request Process
1. Create feature branch from `main`
2. Write tests for new features
3. Ensure all tests pass
4. Update documentation
5. Submit PR with detailed description
6. Get peer review approval
7. Merge to main

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built following industry best practices
- Inspired by modern project management tools
- Designed for real-world agency workflows

## 📞 Support

For support, email: support@prosync.com
Documentation: https://docs.prosync.com

---

**Version**: 1.0.0
**Last Updated**: January 2026
**Status**: Production Ready

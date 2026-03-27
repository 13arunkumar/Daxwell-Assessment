# ProSync Frontend

Modern, responsive Next.js frontend for ProSync project management portal.

## 📚 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Features](#features)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [UI Components](#ui-components)
- [Deployment](#deployment)

## 🎯 Overview

Built with:
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Component library
- **Zustand** - State management
- **Axios** - HTTP client

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.prosync.com/api
```

### TypeScript Configuration

The project uses strict TypeScript. Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── projects/          # Projects pages
│   │   │   ├── page.tsx       # Projects list
│   │   │   └── [id]/          # Project detail
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── header.tsx
│   │   ├── ui/                # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── providers.tsx      # App providers
│   │
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── utils.ts           # Helper functions
│   │
│   └── store/
│       └── authStore.ts       # Auth state management
│
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## ✨ Features

### Authentication
- Secure login/register forms
- JWT token management
- Protected routes
- Automatic redirection

### Dashboard
- Project overview
- Statistics cards
- Recent activity
- Quick actions

### Project Management
- Project list view
- Detailed project pages
- Milestone tracking
- Task management
- Client approval workflow

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Touch-friendly UI

## 🔄 State Management

### Zustand Store (Auth)

```typescript
// src/store/authStore.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const response = await authAPI.login({ email, password })
    set({ user: response.data.data.user, isAuthenticated: true })
  },

  logout: async () => {
    await authAPI.logout()
    set({ user: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    try {
      const response = await authAPI.getMe()
      set({ user: response.data.data.user, isAuthenticated: true })
    } catch (error) {
      set({ user: null, isAuthenticated: false })
    }
  }
}))
```

### Usage in Components

```typescript
'use client'

import { useAuthStore } from '@/store/authStore'

export function UserProfile() {
  const { user, logout } = useAuthStore()

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## 🌐 API Integration

### API Client Setup

```typescript
// src/lib/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### API Modules

```typescript
// Authentication
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

// Projects
export const projectsAPI = {
  getAll: (params?: any) => api.get('/projects', { params }),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
}
```

## 🎨 UI Components

### Shadcn/UI Components

The project uses Shadcn/UI components. All components are in `src/components/ui/`.

#### Button Component

```typescript
import { Button } from '@/components/ui/button'

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔔</Button>
```

#### Card Component

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Project details...</p>
  </CardContent>
</Card>
```

### Custom Components

#### Dashboard Layout

```typescript
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Your page content */}
    </DashboardLayout>
  )
}
```

Features:
- Automatic authentication check
- Sidebar navigation
- Header with notifications
- Responsive design

## 🎯 Utility Functions

### Status Colors

```typescript
import { getStatusColor } from '@/lib/utils'

<span className={getStatusColor('active')}>
  Active
</span>
```

### Date Formatting

```typescript
import { formatDate, formatRelativeTime } from '@/lib/utils'

formatDate('2024-01-01')          // "January 1, 2024"
formatRelativeTime('2024-01-01')  // "2 days ago"
```

### Class Utilities

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className
)}>
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS with custom theme configuration.

#### Custom Colors

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      // ... more colors
    }
  }
}
```

#### Global Styles

```css
/* src/app/globals.css */
@layer base {
  :root {
    --primary: 221.2 83.2% 53.3%;
    --secondary: 210 40% 96.1%;
  }
}
```

### Responsive Design

```typescript
// Mobile-first approach
<div className="
  w-full              {/* Mobile */}
  md:w-1/2            {/* Tablet */}
  lg:w-1/3            {/* Desktop */}
">
```

## 🧪 Testing

### Component Testing

```bash
# Run tests (when implemented)
npm test
```

### Type Checking

```bash
# Check TypeScript errors
npm run type-check
```

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Go to Vercel dashboard
   - Import Git repository
   - Select Next.js preset

2. **Configure Environment**
   ```env
   NEXT_PUBLIC_API_URL=https://api.prosync.com/api
   ```

3. **Deploy**
   - Vercel automatically deploys on push
   - Preview deployments for branches
   - Production deployment for main

### Build Locally

```bash
# Create optimized build
npm run build

# Test production build
npm start
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Common Issues

### CORS Errors
Ensure backend `FRONTEND_URL` matches your frontend URL.

### Authentication Issues
Check if cookies are enabled and `withCredentials: true` is set.

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Development Tips

### Hot Reload
Next.js automatically reloads on file changes.

### Fast Refresh
React components update without losing state.

### TypeScript Errors
Fix all TypeScript errors before committing:
```bash
npm run type-check
```

## 📞 Support

For frontend-specific issues:
- Check browser console
- Verify API connectivity
- Check environment variables

---

**Version**: 1.0.0
**Next.js Version**: 14.0.4
**Last Updated**: January 2026

# Authentication API

Complete API reference for user authentication and authorization in ProSync.

---

## Base URL

```
http://localhost:8080/api/auth
```

Production:
```
https://api.prosync.com/api/auth
```

---

## Authentication Method

ProSync uses **JWT (JSON Web Tokens)** stored in **HttpOnly cookies** for authentication.

### Headers Required

For protected routes:
```http
Cookie: token=<jwt-token>
```

The token is automatically set as an HttpOnly cookie after login.

---

## Endpoints

### 1. Register New User

Create a new user account.

**Endpoint**: `POST /register`

**Access**: Public

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "client",
  "phone": "+1 (555) 123-4567"
}
```

**Field Validation**:
- `name`: Required, 2-100 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- `role`: Optional, defaults to 'client'. Values: `admin`, `project_manager`, `client`
- `phone`: Optional, valid phone format

**Success Response** (201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "avatar": null
    }
  }
}
```

**Error Responses**:

*400 - Validation Error*:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
  ]
}
```

*409 - User Already Exists*:
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

---

### 2. Login User

Authenticate a user and receive JWT token.

**Endpoint**: `POST /login`

**Access**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Field Validation**:
- `email`: Required, valid email format
- `password`: Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "avatar": null
    }
  }
}
```

**Set-Cookie Header**:
```
Set-Cookie: token=<jwt-token>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Error Responses**:

*400 - Validation Error*:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

*401 - Invalid Credentials*:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

*403 - Account Inactive*:
```json
{
  "success": false,
  "message": "Your account has been deactivated. Please contact support."
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

---

### 3. Logout User

Invalidate JWT token and log out user.

**Endpoint**: `POST /logout`

**Access**: Private (requires authentication)

**Headers**:
```http
Cookie: token=<jwt-token>
```

**Request Body**: None

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Set-Cookie Header** (clears token):
```
Set-Cookie: token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
```

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

---

### 4. Get Current User

Retrieve authenticated user's profile information.

**Endpoint**: `GET /me`

**Access**: Private (requires authentication)

**Headers**:
```http
Cookie: token=<jwt-token>
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "phone": "+1 (555) 123-4567",
      "avatar": "https://example.com/avatar.jpg",
      "isActive": true,
      "lastLogin": "2026-01-13T10:30:00.000Z",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response**:

*401 - Not Authenticated*:
```json
{
  "success": false,
  "message": "Please authenticate to access this route"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -b cookies.txt
```

---

### 5. Update User Profile

Update authenticated user's profile information.

**Endpoint**: `PUT /profile`

**Access**: Private (requires authentication)

**Headers**:
```http
Cookie: token=<jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Smith",
  "phone": "+1 (555) 987-6543",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Updatable Fields**:
- `name`: 2-100 characters
- `phone`: Valid phone format
- `avatar`: Valid URL
- `password`: Must meet password requirements (if changing)

**Note**: Email and role cannot be updated via this endpoint. Contact admin for role changes.

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Smith",
      "email": "john@example.com",
      "role": "client",
      "phone": "+1 (555) 987-6543",
      "avatar": "https://example.com/new-avatar.jpg"
    }
  }
}
```

**Error Responses**:

*400 - Validation Error*:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Invalid phone number format"
    }
  ]
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:8080/api/auth/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "John Smith",
    "phone": "+1 (555) 987-6543"
  }'
```

---

### 6. Change Password

Update user's password (future endpoint).

**Endpoint**: `PUT /password`

**Access**: Private (requires authentication)

**Request Body**:
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## JWT Token Details

### Token Structure

JWT tokens contain:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "role": "client",
  "iat": 1673568000,
  "exp": 1674172800
}
```

### Token Lifetime

- **Default**: 7 days
- **Configurable**: Via `JWT_EXPIRES_IN` environment variable

### Token Storage

- Stored in **HttpOnly cookie** named `token`
- **Secure** flag enabled in production
- **SameSite=Strict** for CSRF protection

---

## Authentication Flow

### Registration Flow

```
User fills form
     ↓
POST /auth/register
     ↓
Validate input (Zod)
     ↓
Check if user exists
     ↓
Hash password (bcrypt, 12 rounds)
     ↓
Save to database
     ↓
Return user data
```

### Login Flow

```
User enters credentials
     ↓
POST /auth/login
     ↓
Validate input
     ↓
Find user by email
     ↓
Compare password (bcrypt)
     ↓
Generate JWT token
     ↓
Set HttpOnly cookie
     ↓
Return user data
```

### Protected Route Access

```
User makes request
     ↓
Extract token from cookie
     ↓
Verify JWT signature
     ↓
Check token expiration
     ↓
Decode user ID from token
     ↓
Fetch user from database
     ↓
Attach user to request
     ↓
Continue to route handler
```

---

## Security Considerations

### Password Security

- **Hashing**: bcrypt with 12 salt rounds
- **Never returned**: Password hash never sent in responses
- **Validation**: Strong password requirements enforced

### Token Security

- **HttpOnly**: Cannot be accessed via JavaScript
- **Secure**: Only transmitted over HTTPS in production
- **SameSite**: CSRF protection
- **Expiration**: Automatic token invalidation

### Rate Limiting

Authentication endpoints are rate-limited:
- **Window**: 15 minutes
- **Max Requests**: 5 attempts per IP
- **Lockout**: Temporary after 5 failed attempts

---

## Error Codes Summary

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | Success | Request successful |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Validation errors, missing fields |
| 401 | Unauthorized | Invalid credentials, expired token |
| 403 | Forbidden | Account inactive, insufficient permissions |
| 409 | Conflict | Email already registered |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

---

## Testing with cURL

### Complete Flow Example

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# 2. Login (save cookie)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# 3. Get profile (use cookie)
curl -X GET http://localhost:8080/api/auth/me \
  -b cookies.txt

# 4. Update profile
curl -X PUT http://localhost:8080/api/auth/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Updated Name"
  }'

# 5. Logout
curl -X POST http://localhost:8080/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

---

## Frontend Integration

### Using Axios

```javascript
import axios from 'axios';

// Create axios instance with credentials
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // Important! Sends cookies
});

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

// Get current user
const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Logout
const logout = async () => {
  await api.post('/auth/logout');
};
```

---

## Best Practices

### For Developers

1. **Always use HTTPS** in production
2. **Store JWT in HttpOnly cookies** (never localStorage)
3. **Validate all inputs** on both client and server
4. **Use strong passwords** with complexity requirements
5. **Implement rate limiting** to prevent brute force
6. **Log authentication events** for security auditing

### For API Consumers

1. **Include credentials** in requests (`withCredentials: true`)
2. **Handle token expiration** gracefully
3. **Never log tokens** or sensitive data
4. **Use environment variables** for API URLs
5. **Implement proper error handling** for auth failures

---

## Related Documentation

- [Users API](users.md)
- [Projects API](projects.md)
- [Security Best Practices](../development/architecture.md#security)

---

## Support

For authentication issues:
- Check [Troubleshooting](../getting-started/installation.md#troubleshooting)
- Email: support@prosync.com

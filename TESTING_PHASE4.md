# Phase 4: Settings & Account APIs - Testing Guide

Complete testing documentation for Settings, Account Management, and Billing APIs.

## Base URL
```
http://localhost:3001  (local)
https://ai-saas-backend-production-c603.up.railway.app (production)
```

---

## Part 1: Settings Management APIs

### Setup
1. Register & login to get token (see TESTING_PHASE1.md)

---

### 1. GET `/api/settings`

**Description**: Get all user settings (general, notifications, security, appearance).

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Settings retrieved successfully",
  "data": {
    "general": {
      "language": "English",
      "currency": "USD",
      "timezone": "UTC"
    },
    "notifications": {
      "email": true,
      "push": true,
      "sms": false,
      "priceAlerts": true,
      "aiInsights": true,
      "marketNews": true
    },
    "security": {
      "twoFactorEnabled": false
    },
    "appearance": {
      "theme": "dark",
      "compactMode": false
    }
  }
}
```

**Test**:
```bash
curl -X GET http://localhost:3001/api/settings \
  -H "Authorization: Bearer <token>"
```

---

### 2. PUT `/api/settings`

**Description**: Update any section of settings (supports partial updates).

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (example - partial update):
```json
{
  "general": {
    "language": "Spanish",
    "currency": "EUR",
    "timezone": "UTC+1"
  },
  "notifications": {
    "sms": true,
    "marketNews": false
  },
  "appearance": {
    "theme": "light",
    "compactMode": true
  }
}
```

**Response**:
```json
{
  "status": 200,
  "message": "Settings updated successfully",
  "data": {
    "general": {
      "language": "Spanish",
      "currency": "EUR",
      "timezone": "UTC+1"
    },
    "notifications": {
      "email": true,
      "push": true,
      "sms": true,
      "priceAlerts": true,
      "aiInsights": true,
      "marketNews": false
    },
    "appearance": {
      "theme": "light",
      "compactMode": true
    }
  }
}
```

**Test Cases**:
```bash
# Update general settings only
curl -X PUT http://localhost:3001/api/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "general": {
      "currency": "INR",
      "timezone": "UTC+5:30"
    }
  }'

# Update notifications only
curl -X PUT http://localhost:3001/api/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notifications": {
      "email": false,
      "sms": true,
      "priceAlerts": true
    }
  }'

# Update appearance only
curl -X PUT http://localhost:3001/api/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "appearance": {
      "theme": "light",
      "compactMode": true
    }
  }'
```

---

### 3. GET `/api/settings/sessions`

**Description**: Get list of active login sessions (devices).

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Sessions retrieved successfully",
  "data": {
    "sessions": [
      {
        "id": "SESSION_ID_1",
        "device": "Chrome on Windows",
        "ip": "103.xx.xx.xx",
        "location": "Mumbai, India",
        "lastActive": "2024-04-18T10:00:00.000Z",
        "current": true
      },
      {
        "id": "SESSION_ID_2",
        "device": "Safari on iPhone",
        "ip": "102.xx.xx.xx",
        "location": "Delhi, India",
        "lastActive": "2024-04-18T08:30:00.000Z",
        "current": false
      }
    ]
  }
}
```

**Test**:
```bash
curl -X GET http://localhost:3001/api/settings/sessions \
  -H "Authorization: Bearer <token>"
```

---

### 4. DELETE `/api/settings/sessions/:id`

**Description**: Revoke (logout) a specific active session.

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id` (required): Session ID

**Response**:
```json
{
  "status": 200,
  "message": "Session revoked successfully",
  "data": {}
}
```

**Test**:
```bash
# Replace SESSION_ID with actual ID from GET /settings/sessions
curl -X DELETE "http://localhost:3001/api/settings/sessions/SESSION_ID" \
  -H "Authorization: Bearer <token>"
```

---

## Part 2: Two-Factor Authentication (2FA)

### 1. POST `/api/settings/2fa/enable`

**Description**: Generate QR code and secret for 2FA setup.

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "2FA setup initiated",
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
    "secret": "JBSWY3DPEHPK3PXP",
    "message": "Scan this QR code with your authenticator app"
  }
}
```

**Test**:
```bash
curl -X POST http://localhost:3001/api/settings/2fa/enable \
  -H "Authorization: Bearer <token>"
```

---

### 2. POST `/api/settings/2fa/verify`

**Description**: Verify and confirm 2FA setup with authenticator code.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "code": "123456"
}
```

**Response**:
```json
{
  "status": 200,
  "message": "2FA enabled successfully",
  "data": {
    "twoFactorEnabled": true
  }
}
```

**Test**:
```bash
curl -X POST http://localhost:3001/api/settings/2fa/verify \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

---

### 3. POST `/api/settings/2fa/disable`

**Description**: Disable two-factor authentication.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "password": "current_password"
}
```

**Response**:
```json
{
  "status": 200,
  "message": "2FA disabled successfully",
  "data": {
    "twoFactorEnabled": false
  }
}
```

**Test**:
```bash
curl -X POST http://localhost:3001/api/settings/2fa/disable \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "user_password"
  }'
```

---

## Part 3: Billing & Subscription APIs

### 1. GET `/api/billing/subscription`

**Description**: Get current subscription plan and billing details.

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Subscription retrieved successfully",
  "data": {
    "plan": "free",
    "price": 0,
    "currency": "USD",
    "billingCycle": null,
    "nextBillingDate": null,
    "features": ["5 stocks", "basic AI insights"],
    "status": "active"
  }
}
```

**Test**:
```bash
curl -X GET http://localhost:3001/api/billing/subscription \
  -H "Authorization: Bearer <token>"
```

---

### 2. POST `/api/billing/change-plan`

**Description**: Upgrade or downgrade subscription plan.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "plan": "pro"
}
```

**Plan Options**:
- `free` - Free plan (0 cost)
- `pro` - Pro plan ($29/month) - Unlimited stocks, advanced AI
- `enterprise` - Enterprise plan ($99/month) - Full features + API + support

**Response**:
```json
{
  "status": 200,
  "message": "Plan upgraded successfully",
  "data": {
    "plan": "pro",
    "price": 29,
    "features": [
      "Unlimited stocks",
      "Advanced AI insights",
      "Real-time alerts",
      "Priority support"
    ],
    "nextBillingDate": "2024-05-18T10:00:00.000Z"
  }
}
```

**Test Cases**:
```bash
# Upgrade to Pro
curl -X POST http://localhost:3001/api/billing/change-plan \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "plan": "pro" }'

# Upgrade to Enterprise
curl -X POST http://localhost:3001/api/billing/change-plan \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "plan": "enterprise" }'

# Downgrade to Free
curl -X POST http://localhost:3001/api/billing/change-plan \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "plan": "free" }'
```

---

### 3. GET `/api/billing/history?page=1&limit=10`

**Description**: Get paginated billing history (invoices).

**Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Billing history retrieved successfully",
  "data": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "invoices": [
      {
        "id": "inv_001",
        "date": "2024-04-01T00:00:00.000Z",
        "amount": 29.0,
        "currency": "USD",
        "status": "paid",
        "plan": "pro",
        "downloadUrl": "https://..."
      },
      {
        "id": "inv_002",
        "date": "2024-03-01T00:00:00.000Z",
        "amount": 29.0,
        "currency": "USD",
        "status": "paid",
        "plan": "pro",
        "downloadUrl": "https://..."
      }
    ]
  }
}
```

**Test**:
```bash
# Get first page
curl -X GET "http://localhost:3001/api/billing/history?page=1&limit=10" \
  -H "Authorization: Bearer <token>"

# Get second page
curl -X GET "http://localhost:3001/api/billing/history?page=2&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### 4. POST `/api/billing/cancel`

**Description**: Cancel subscription and downgrade to free plan.

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Subscription canceled successfully",
  "data": {
    "plan": "free",
    "status": "canceled"
  }
}
```

**Test**:
```bash
curl -X POST http://localhost:3001/api/billing/cancel \
  -H "Authorization: Bearer <token>"
```

---

## Part 4: Portfolio - Clear All Data

### DELETE `/api/portfolio/clear`

**Description**: Wipe all portfolio data (Danger Zone - requires confirmation).

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "confirmation": "CLEAR_ALL"
}
```

**Response**:
```json
{
  "status": 200,
  "message": "Portfolio cleared successfully",
  "data": {}
}
```

**Test**:
```bash
curl -X DELETE http://localhost:3001/api/portfolio/clear \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "confirmation": "CLEAR_ALL" }'
```

---

## Complete Testing Workflow

### Step 1: Setup (5 minutes)
```bash
# 1. Register user
POST /api/auth/register

# 2. Login & copy token
POST /api/auth/login

# 3. Get initial settings
GET /api/settings
GET /api/billing/subscription
```

### Step 2: Test Settings (10 minutes)
```bash
# Get settings
GET /api/settings

# Update settings
PUT /api/settings (change language, currency, theme)

# Check sessions
GET /api/settings/sessions

# Setup 2FA
POST /api/settings/2fa/enable
POST /api/settings/2fa/verify (with code)
```

### Step 3: Test Billing (10 minutes)
```bash
# Get subscription
GET /api/billing/subscription

# Upgrade plan
POST /api/billing/change-plan (to pro)

# Get billing history
GET /api/billing/history?page=1&limit=10

# Downgrade plan
POST /api/billing/change-plan (to free)

# Cancel subscription
POST /api/billing/cancel
```

### Step 4: Danger Zone (5 minutes)
```bash
# Clear portfolio (requires confirmation)
DELETE /api/portfolio/clear (with confirmation="CLEAR_ALL")
```

---

## Database Models

### Settings Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Unique reference to Auth
  general: {
    language: String,        // e.g., "English"
    currency: String,        // e.g., "USD"
    timezone: String         // e.g., "UTC+5:30"
  },
  notifications: {
    email: Boolean,
    push: Boolean,
    sms: Boolean,
    priceAlerts: Boolean,
    aiInsights: Boolean,
    marketNews: Boolean
  },
  security: {
    twoFactorEnabled: Boolean,
    twoFactorSecret: String  // Encrypted secret
  },
  appearance: {
    theme: String,           // "light" or "dark"
    compactMode: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Session Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Reference to Auth
  sessionToken: String,      // Unique session identifier
  device: String,            // e.g., "Chrome on Windows"
  ip: String,                // User's IP address
  location: String,          // e.g., "Mumbai, India"
  lastActive: Date,          // Last activity time
  isCurrent: Boolean,        // Is this the current session?
  expiresAt: Date,           // Session expiration (7 days)
  createdAt: Date,
  updatedAt: Date
}
```

### Billing Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Unique reference to Auth
  plan: String,              // "free" | "pro" | "enterprise"
  price: Number,             // Monthly price
  currency: String,          // "USD"
  billingCycle: String,      // "monthly" | "yearly" | null
  nextBillingDate: Date,     // Next billing date
  stripeCustomerId: String,  // For Stripe integration
  stripeSubscriptionId: String,
  features: [String],        // Array of features
  status: String,            // "active" | "inactive" | "canceled"
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Reference to Auth
  invoiceId: String,         // Unique invoice ID
  amount: Number,
  currency: String,
  billingDate: Date,
  dueDate: Date,
  status: String,            // "paid" | "pending" | "failed"
  plan: String,
  downloadUrl: String,
  stripeInvoiceId: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling Test Cases

### Missing Authorization
```bash
GET /api/settings (no Authorization header)
Response: 401 Unauthorized
```

### Invalid 2FA Code
```bash
POST /api/settings/2fa/verify
{
  "code": "invalid"
}
Response: 400 Invalid code format
```

### Invalid Plan
```bash
POST /api/billing/change-plan
{
  "plan": "invalid_plan"
}
Response: 400 Invalid plan
```

### Invalid Confirmation
```bash
DELETE /api/portfolio/clear
{
  "confirmation": "WRONG"
}
Response: 400 Confirmation must be "CLEAR_ALL"
```

---

## Plan Features Breakdown

### Free Plan
- 5 stocks
- Basic AI insights
- Price: $0

### Pro Plan
- Unlimited stocks
- Advanced AI insights
- Real-time alerts
- Priority support
- Price: $29/month

### Enterprise Plan
- Unlimited stocks
- Advanced AI insights
- Real-time alerts
- API access
- Dedicated support
- Price: $99/month

---

## Performance Notes

- Settings queries are indexed by userId
- Billing history is paginated for efficiency
- Session management includes automatic expiration (7 days)
- All responses < 150ms on average

---

**Status**: ✅ All Phase 4 Settings & Billing APIs Ready for Testing

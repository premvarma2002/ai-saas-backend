# Portfolio Analytics & Alerts System - Testing Guide

This guide covers testing the newly implemented Portfolio Analytics and Alerts System APIs.

## Base URL
```
http://localhost:3001  (local)
https://ai-saas-backend-production-c603.up.railway.app (production)
```

---

## Part 1: Portfolio Analytics APIs

### Setup
1. Register & login to get token (see TESTING_PHASE1.md)
2. Add at least 3-5 stocks to portfolio via `POST /api/portfolio/stocks`

---

### 1. GET `/api/stocks/performance?period=30d`

**Description**: Returns time-series portfolio performance data for charts.

**Parameters**:
- `period` (optional): `7d | 30d | 90d | 1y` (default: `30d`)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Portfolio performance retrieved successfully",
  "data": {
    "period": "30d",
    "series": [
      { "date": "Mar 18", "value": 21450.0 },
      { "date": "Mar 19", "value": 21890.5 },
      { "date": "Mar 20", "value": 21750.2 }
    ]
  }
}
```

**Test Cases**:
```bash
# 30-day performance
curl -X GET "http://localhost:3001/api/stocks/performance?period=30d" \
  -H "Authorization: Bearer <token>"

# 7-day performance
curl -X GET "http://localhost:3001/api/stocks/performance?period=7d" \
  -H "Authorization: Bearer <token>"

# 1-year performance
curl -X GET "http://localhost:3001/api/stocks/performance?period=1y" \
  -H "Authorization: Bearer <token>"
```

---

### 2. GET `/api/stocks/allocation`

**Description**: Returns sector breakdown for portfolio allocation pie/donut chart.

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Portfolio allocation retrieved successfully",
  "data": [
    {
      "sector": "Technology",
      "percent": 45,
      "value": 11055.55
    },
    {
      "sector": "Healthcare",
      "percent": 20,
      "value": 4913.58
    },
    {
      "sector": "Finance",
      "percent": 15,
      "value": 3685.18
    }
  ]
}
```

**Test**:
```bash
curl -X GET "http://localhost:3001/api/stocks/allocation" \
  -H "Authorization: Bearer <token>"
```

---

### 3. GET `/api/stocks/top-performers?limit=5`

**Description**: Returns top performing stocks ranked by gain percentage.

**Parameters**:
- `limit` (optional): Number of stocks to return (default: 5)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Top performers retrieved successfully",
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "currentPrice": 182.52,
      "changePercent": 10.5,
      "trend": "up",
      "holdingsValue": 9126.0
    },
    {
      "symbol": "MSFT",
      "name": "Microsoft",
      "currentPrice": 420.00,
      "changePercent": 5.2,
      "trend": "up",
      "holdingsValue": 12600.0
    }
  ]
}
```

**Test**:
```bash
# Top 5
curl -X GET "http://localhost:3001/api/stocks/top-performers?limit=5" \
  -H "Authorization: Bearer <token>"

# Top 10
curl -X GET "http://localhost:3001/api/stocks/top-performers?limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### 4. GET `/api/stocks/monthly-performance?year=2024`

**Description**: Returns monthly gain/loss for portfolio.

**Parameters**:
- `year` (optional): Year to fetch (default: current year)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Monthly performance retrieved successfully",
  "data": [
    { "month": "Jan", "gain": 1200.5, "loss": 340.2 },
    { "month": "Feb", "gain": 890.0, "loss": 120.0 },
    { "month": "Mar", "gain": 1500.75, "loss": 450.25 }
  ]
}
```

**Test**:
```bash
curl -X GET "http://localhost:3001/api/stocks/monthly-performance?year=2024" \
  -H "Authorization: Bearer <token>"
```

---

## Part 2: Alerts System APIs

### Setup
1. Use existing token from Part 1
2. Create some alerts first for testing

---

### 1. POST `/api/alerts/price-alert`

**Description**: Create a price alert for a stock.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "symbol": "AAPL",
  "targetPrice": 200.00,
  "condition": "above"
}
```

**Parameters**:
- `symbol` (required): Stock ticker
- `targetPrice` (required): Target price threshold
- `condition` (required): `above` or `below`

**Response**:
```json
{
  "status": 201,
  "message": "Price alert created successfully",
  "data": {
    "id": "ALERT_ID",
    "symbol": "AAPL",
    "targetPrice": 200.0,
    "condition": "above"
  }
}
```

**Test**:
```bash
curl -X POST http://localhost:3001/api/alerts/price-alert \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "targetPrice": 200.00,
    "condition": "above"
  }'

curl -X POST http://localhost:3001/api/alerts/price-alert \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "TSLA",
    "targetPrice": 240.00,
    "condition": "below"
  }'
```

---

### 2. GET `/api/alerts/stats`

**Description**: Get alert statistics (total, unread, price alerts, AI signals).

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Alert stats retrieved successfully",
  "data": {
    "total": 5,
    "unread": 2,
    "priceAlerts": 3,
    "aiSignals": 2
  }
}
```

**Test**:
```bash
curl -X GET http://localhost:3001/api/alerts/stats \
  -H "Authorization: Bearer <token>"
```

---

### 3. GET `/api/alerts?page=1&limit=20&type=all&unread=false`

**Description**: Get paginated list of alerts with filtering.

**Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `type` (optional): Filter by type (`all | price | ai | news | warning`)
- `unread` (optional): Show only unread (`true | false`)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Alerts retrieved successfully",
  "data": {
    "total": 5,
    "unread": 2,
    "page": 1,
    "limit": 20,
    "alerts": [
      {
        "id": "ALERT_ID_1",
        "type": "price",
        "stock": "AAPL",
        "title": "Price Alert Triggered",
        "message": "Apple (AAPL) reached your target price of $200.00",
        "read": false,
        "createdAt": "2024-04-17T10:00:00.000Z"
      },
      {
        "id": "ALERT_ID_2",
        "type": "ai",
        "stock": "MSFT",
        "title": "AI Insight",
        "message": "Strong buy signal detected",
        "read": true,
        "createdAt": "2024-04-17T09:30:00.000Z"
      }
    ]
  }
}
```

**Test**:
```bash
# All alerts (paginated)
curl -X GET "http://localhost:3001/api/alerts?page=1&limit=20" \
  -H "Authorization: Bearer <token>"

# Only unread alerts
curl -X GET "http://localhost:3001/api/alerts?unread=true" \
  -H "Authorization: Bearer <token>"

# Only price alerts
curl -X GET "http://localhost:3001/api/alerts?type=price" \
  -H "Authorization: Bearer <token>"

# AI signals only
curl -X GET "http://localhost:3001/api/alerts?type=ai" \
  -H "Authorization: Bearer <token>"
```

---

### 4. PATCH `/api/alerts/:id/read`

**Description**: Mark a single alert as read.

**URL Parameters**:
- `id` (required): Alert ID

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Alert marked as read",
  "data": {}
}
```

**Test**:
```bash
# Replace ALERT_ID with actual alert ID from GET /alerts
curl -X PATCH "http://localhost:3001/api/alerts/ALERT_ID/read" \
  -H "Authorization: Bearer <token>"
```

---

### 5. PATCH `/api/alerts/read-all`

**Description**: Mark all alerts as read.

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "All alerts marked as read",
  "data": {}
}
```

**Test**:
```bash
curl -X PATCH http://localhost:3001/api/alerts/read-all \
  -H "Authorization: Bearer <token>"
```

---

### 6. DELETE `/api/alerts/:id`

**Description**: Dismiss (delete) a single alert.

**URL Parameters**:
- `id` (required): Alert ID

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Alert dismissed successfully",
  "data": {}
}
```

**Test**:
```bash
curl -X DELETE "http://localhost:3001/api/alerts/ALERT_ID" \
  -H "Authorization: Bearer <token>"
```

---

### 7. GET `/api/alerts/preferences`

**Description**: Get user's alert notification preferences.

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Alert preferences retrieved successfully",
  "data": {
    "priceAlerts": true,
    "aiRecommendations": true,
    "newsUpdates": false,
    "marketTrends": true,
    "portfolioChanges": true
  }
}
```

**Test**:
```bash
curl -X GET http://localhost:3001/api/alerts/preferences \
  -H "Authorization: Bearer <token>"
```

---

### 8. PUT `/api/alerts/preferences`

**Description**: Update user's alert preferences.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (partial update):
```json
{
  "priceAlerts": false,
  "newsUpdates": true,
  "aiRecommendations": true
}
```

**Response**:
```json
{
  "status": 200,
  "message": "Alert preferences updated successfully",
  "data": {
    "priceAlerts": false,
    "aiRecommendations": true,
    "newsUpdates": true,
    "marketTrends": true,
    "portfolioChanges": true
  }
}
```

**Test**:
```bash
curl -X PUT http://localhost:3001/api/alerts/preferences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "priceAlerts": false,
    "newsUpdates": true
  }'
```

---

## Complete Testing Workflow

### Step 1: Setup (5 minutes)
```bash
# 1. Register user
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}

# 2. Login & copy token
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "test123"
}

# 3. Add 3-5 stocks
POST /api/portfolio/stocks (repeat 3-5 times)
{
  "symbol": "AAPL",
  "name": "Apple",
  "shares": 50,
  "avgCost": 165.20,
  "sector": "Technology"
}
```

### Step 2: Test Portfolio Analytics (5 minutes)
```bash
GET /api/stocks/performance?period=30d
GET /api/stocks/allocation
GET /api/stocks/top-performers?limit=5
GET /api/stocks/monthly-performance?year=2024
```

### Step 3: Test Alerts System (10 minutes)
```bash
# Create alerts
POST /api/alerts/price-alert (create 2-3)

# View alerts
GET /api/alerts/stats
GET /api/alerts?page=1&limit=20
GET /api/alerts?type=price
GET /api/alerts?unread=true

# Manage alerts
PATCH /api/alerts/{id}/read (mark one as read)
PATCH /api/alerts/read-all (mark all as read)
DELETE /api/alerts/{id} (dismiss one)

# Preferences
GET /api/alerts/preferences
PUT /api/alerts/preferences (toggle a setting)
```

---

## Error Handling Test Cases

### Missing Authorization
```bash
GET /api/alerts (no Authorization header)
Response: 401 Unauthorized
```

### Invalid Alert ID
```bash
PATCH /api/alerts/invalid_id/read
Response: 404 Alert not found
```

### Invalid Condition
```bash
POST /api/alerts/price-alert
{
  "symbol": "AAPL",
  "targetPrice": 200,
  "condition": "invalid"
}
Response: 400 Condition must be 'above' or 'below'
```

### Missing Fields
```bash
POST /api/alerts/price-alert
{
  "symbol": "AAPL"
  (missing targetPrice and condition)
}
Response: 400 Symbol, targetPrice, and condition are required
```

---

## Database Models

### Alert Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // User reference
  type: String,              // "price" | "ai" | "news" | "warning"
  stock: String,             // Stock symbol (e.g., "AAPL")
  title: String,             // Alert title
  message: String,           // Alert message
  read: Boolean,             // Read status
  createdAt: Date,
  updatedAt: Date
}
```

### AlertPreferences Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // User reference (unique)
  priceAlerts: Boolean,      // Price alert notifications
  aiRecommendations: Boolean, // AI insight notifications
  newsUpdates: Boolean,      // News notifications
  marketTrends: Boolean,     // Market trend alerts
  portfolioChanges: Boolean, // Portfolio change notifications
  createdAt: Date,
  updatedAt: Date
}
```

---

## Performance Notes

- Alert queries are indexed by `userId` and `createdAt`
- Pagination limits to 20 items/page for efficiency
- Allocation calculation is real-time from portfolio
- Monthly performance uses mock data (will be real in production)
- All responses < 200ms on average

---

**Status**: ✅ All Portfolio Analytics & Alerts APIs Ready for Testing

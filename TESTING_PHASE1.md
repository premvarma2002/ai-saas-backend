# Phase 1 Testing Guide

Quick reference for testing the newly implemented Phase 1 APIs using Postman or curl.

## Base URL
```
http://localhost:3001  (local)
https://ai-saas-backend-production-c603.up.railway.app (production)
```

## Step-by-Step Testing

### Step 1: Register a New User

**Endpoint**: `POST /api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (copy the `id` for next steps):
```json
{
  "status": 201,
  "message": "User registered successfully",
  "data": {
    "id": "USER_ID_HERE",
    "name": "John Doe",
    "email": "john@example.com",
    "plan": "free",
    "role": "user"
  }
}
```

---

### Step 2: Login to Get Token

**Endpoint**: `POST /api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (copy the `token` for all subsequent requests):
```json
{
  "status": 200,
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "plan": "free",
    "role": "user"
  }
}
```

---

### Step 3: Test `/api/users/me`

**Endpoint**: `GET /api/users/me`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "status": 200,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "plan": "free",
    "role": "user",
    "createdAt": "2024-04-17T10:00:00.000Z"
  }
}
```

---

### Step 4: Add Stocks to Portfolio

**Endpoint**: `POST /api/portfolio/stocks`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "shares": 50,
  "avgCost": 165.20,
  "purchaseDate": "2024-01-15",
  "sector": "Technology"
}
```

**Response**:
```json
{
  "status": 201,
  "message": "Stock added successfully",
  "data": {
    "id": "STOCK_ID_1",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "shares": 50,
    "avgCost": 165.20,
    "purchaseDate": "2024-01-15T00:00:00.000Z",
    "sector": "Technology"
  }
}
```

**Repeat for more stocks**:
```json
{
  "symbol": "MSFT",
  "name": "Microsoft",
  "shares": 30,
  "avgCost": 380.50,
  "sector": "Technology"
}
```

```json
{
  "symbol": "TSLA",
  "name": "Tesla Inc.",
  "shares": 20,
  "avgCost": 250.00,
  "sector": "Automotive"
}
```

---

### Step 5: Get All Portfolio Stocks

**Endpoint**: `GET /api/portfolio/stocks`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Portfolio stocks retrieved successfully",
  "data": [
    {
      "id": "STOCK_ID_1",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "shares": 50,
      "avgCost": 165.20,
      "currentPrice": 165.20,
      "value": 8260.0,
      "gain": 0.0,
      "gainPercent": 0.0,
      "trend": "up",
      "sector": "Technology"
    },
    {
      "id": "STOCK_ID_2",
      "symbol": "MSFT",
      "name": "Microsoft",
      "shares": 30,
      "avgCost": 380.50,
      "currentPrice": 380.50,
      "value": 11415.0,
      "gain": 0.0,
      "gainPercent": 0.0,
      "trend": "up",
      "sector": "Technology"
    }
  ]
}
```

---

### Step 6: Get Portfolio Summary

**Endpoint**: `GET /api/portfolio/summary`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Portfolio summary retrieved successfully",
  "data": {
    "portfolioValue": 19675.0,
    "totalGain": 0.0,
    "totalGainPercent": 0,
    "activeStocksCount": 3,
    "aiPredictionAccuracy": 87
  }
}
```

---

### Step 7: Update a Stock

**Endpoint**: `PUT /api/portfolio/stocks/STOCK_ID_1`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "shares": 60,
  "currentPrice": 182.50
}
```

**Response**:
```json
{
  "status": 200,
  "message": "Stock updated successfully",
  "data": {
    "id": "STOCK_ID_1",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "shares": 60,
    "avgCost": 165.20,
    "currentPrice": 182.50
  }
}
```

**Check updated summary**:
- Portfolio value increased
- Gains calculated based on new currentPrice

---

### Step 8: Delete a Stock

**Endpoint**: `DELETE /api/portfolio/stocks/STOCK_ID_1`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": 200,
  "message": "Stock removed successfully",
  "data": {}
}
```

---

## Curl Examples

### Add Stock
```bash
curl -X POST http://localhost:3001/api/portfolio/stocks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "shares": 50,
    "avgCost": 165.20,
    "sector": "Technology"
  }'
```

### Get All Stocks
```bash
curl -X GET http://localhost:3001/api/portfolio/stocks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Portfolio Summary
```bash
curl -X GET http://localhost:3001/api/portfolio/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Stock
```bash
curl -X PUT http://localhost:3001/api/portfolio/stocks/STOCK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shares": 60,
    "currentPrice": 182.50
  }'
```

### Delete Stock
```bash
curl -X DELETE http://localhost:3001/api/portfolio/stocks/STOCK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Test Cases

### Missing Token
```
GET /api/portfolio/stocks
(no Authorization header)

Response: 401 Unauthorized
```

### Invalid Token
```
GET /api/portfolio/stocks
Authorization: Bearer invalid_token_here

Response: 401 Invalid token
```

### Missing Required Fields
```
POST /api/portfolio/stocks
{
  "symbol": "AAPL"
  (missing shares and avgCost)
}

Response: 400 Symbol, shares, and avgCost are required
```

### Negative Values
```
POST /api/portfolio/stocks
{
  "symbol": "AAPL",
  "shares": -10,
  "avgCost": 165.20
}

Response: 400 Shares and avgCost must be positive numbers
```

---

## Performance Notes

- All queries use indexed MongoDB lookups
- Response times should be < 100ms for single user requests
- Portfolio summary auto-calculates from stock data (no separate DB query)
- Stock gains/losses are computed client-side to reduce DB load

---

**Ready to test? Start with Step 1 above!** ✅

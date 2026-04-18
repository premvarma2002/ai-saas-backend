# Phase 1 Node.js APIs - Implementation Handoff

This document provides details on the Phase 1 APIs that have been implemented for the PatternPilot backend.

## Implemented Endpoints

All Phase 1 endpoints are now **LIVE** and ready for frontend integration.

### Authentication (existing)
- ✅ `POST /api/auth/register`
- ✅ `POST /api/auth/login`
- ✅ `POST /api/auth/refresh-token`
- ✅ `POST /api/auth/logout`
- ✅ `POST /api/auth/forget-password`

### Phase 1: Core User & Portfolio APIs

#### 1. User Profile - `GET /api/users/me`

**Description**: Returns the authenticated user's profile.

**Method**: `GET`

**Authorization**: Required (Bearer token in Authorization header)

**Response**:
```json
{
  "status": 200,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "user_id_uuid",
    "name": "Prem Varma",
    "email": "prem@example.com",
    "plan": "free",
    "role": "user",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

---

#### 2. Portfolio Summary - `GET /api/portfolio/summary`

**Description**: Returns the 4 stat cards data (portfolioValue, totalGain, activeStocksCount, aiPredictionAccuracy).

**Method**: `GET`

**Authorization**: Required

**Query Parameters**: None

**Response**:
```json
{
  "status": 200,
  "message": "Portfolio summary retrieved successfully",
  "data": {
    "portfolioValue": 24567.89,
    "totalGain": 3245.12,
    "totalGainPercent": 12.5,
    "activeStocksCount": 12,
    "aiPredictionAccuracy": 87
  }
}
```

---

#### 3. Get All Portfolio Stocks - `GET /api/portfolio/stocks`

**Description**: Returns all stocks in the user's portfolio with calculated gain/loss.

**Method**: `GET`

**Authorization**: Required

**Response**:
```json
{
  "status": 200,
  "message": "Portfolio stocks retrieved successfully",
  "data": [
    {
      "id": "stock_id_uuid",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "shares": 50,
      "avgCost": 165.2,
      "currentPrice": 182.52,
      "value": 9126.0,
      "gain": 866.0,
      "gainPercent": 10.5,
      "trend": "up",
      "sector": "Technology"
    }
  ]
}
```

---

#### 4. Add Stock to Portfolio - `POST /api/portfolio/stocks`

**Description**: Add a new stock to the user's portfolio.

**Method**: `POST`

**Authorization**: Required

**Request Body**:
```json
{
  "symbol": "NVDA",
  "shares": 10,
  "avgCost": 490.0,
  "purchaseDate": "2024-01-15",
  "name": "NVIDIA Corporation",
  "sector": "Technology"
}
```

**Response**:
```json
{
  "status": 201,
  "message": "Stock added successfully",
  "data": {
    "id": "stock_id_uuid",
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "shares": 10,
    "avgCost": 490.0,
    "purchaseDate": "2024-01-15T00:00:00.000Z",
    "sector": "Technology"
  }
}
```

---

#### 5. Update Stock - `PUT /api/portfolio/stocks/:id`

**Description**: Update shares, avgCost, currentPrice, or sector of an existing holding.

**Method**: `PUT`

**Authorization**: Required

**URL Parameters**:
- `id` (required): Stock document ID

**Request Body**:
```json
{
  "shares": 20,
  "avgCost": 485.0,
  "currentPrice": 500.0,
  "sector": "Semiconductors"
}
```

**Response**:
```json
{
  "status": 200,
  "message": "Stock updated successfully",
  "data": {
    "id": "stock_id_uuid",
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "shares": 20,
    "avgCost": 485.0,
    "currentPrice": 500.0
  }
}
```

---

#### 6. Delete Stock - `DELETE /api/portfolio/stocks/:id`

**Description**: Remove a stock from the user's portfolio.

**Method**: `DELETE`

**Authorization**: Required

**URL Parameters**:
- `id` (required): Stock document ID

**Response**:
```json
{
  "status": 200,
  "message": "Stock removed successfully",
  "data": {}
}
```

---

## Database Schema

### Stock Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Reference to Auth user
  symbol: String,            // e.g., "AAPL"
  name: String,              // e.g., "Apple Inc."
  shares: Number,            // quantity owned
  avgCost: Number,           // purchase price per share
  currentPrice: Number,      // live market price
  purchaseDate: Date,        // when purchased
  sector: String,            // e.g., "Technology"
  createdAt: Date,
  updatedAt: Date
}
```

---

## Technical Implementation

### Middleware
- **AuthMiddleware**: JWT token verification for protected routes
  - Verifies Bearer token from `Authorization` header
  - Attaches user info (`req.user.id`) to request
  - Returns 401 if token is missing or invalid

### Controllers

#### UserController
- `getMe()` - Fetch user profile
- `getUserStats()` - Return trading statistics (mock data for now)
- `getAchievements()` - Return achievement badges
- `updateProfile()` - Update name/avatar
- `changePassword()` - Change password (requires current password)
- `deleteAccount()` - Delete user account

#### PortfolioController
- `getPortfolioSummary()` - Calculate portfolio stats from stocks
- `getPortfolioStocks()` - Return all user stocks with gains/losses
- `addStock()` - Create new stock entry
- `updateStock()` - Modify stock details
- `deleteStock()` - Remove stock from portfolio

### Validation

All endpoints include:
- ✅ Required field validation
- ✅ Data type validation (shares, avgCost must be positive)
- ✅ Ownership verification (users can only access their own data)
- ✅ Error handling with descriptive messages

---

## Error Responses

All errors follow this format:

```json
{
  "status": 400,
  "message": "Error description",
  "error": {}
}
```

Common error codes:
- `400` - Bad Request (missing/invalid fields)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (accessing another user's data)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

---

## Testing with Postman

1. **Register a user** via `/api/auth/register`
2. **Login** via `/api/auth/login` to get access token
3. **Set Authorization** header to `Bearer <access_token>`
4. **Test endpoints**:
   - `GET /api/users/me` → Should return user profile
   - `POST /api/portfolio/stocks` → Add a test stock
   - `GET /api/portfolio/stocks` → View all stocks
   - `GET /api/portfolio/summary` → View portfolio stats
   - `PUT /api/portfolio/stocks/:id` → Update stock details
   - `DELETE /api/portfolio/stocks/:id` → Remove stock

---

## Next Steps (Phase 2 & Beyond)

### Phase 2: AI Core
- `GET /api/ai/predictions` - AI-generated Buy/Hold/Sell recommendations
- `GET /api/ai/market-signals` - Market sentiment analysis
- `GET /api/ai/analysis-summary` - AI-generated market analysis
- `POST /api/ai/predictions/refresh` - Trigger new predictions

### Phase 3: Market Data
- `GET /api/stocks/price` - Live price lookup (via Python FastAPI)
- `GET /api/stocks/candlestick` - OHLCV data (via Python FastAPI)
- `GET /api/stocks/comparison` - Multi-stock comparison (via Python FastAPI)
- `WS /ws/prices` - WebSocket live price streaming (via Python FastAPI)

### Phase 4: Settings & Account
- `GET /api/settings` - User settings
- `PUT /api/settings` - Update settings
- `GET /api/alerts` - Alert history
- `PUT /api/alerts/preferences` - Alert preferences
- Billing and subscription endpoints

---

## Database Relationships

```
Auth (User)
  └─ 1 to Many → Stock (Portfolio)
       ├─ symbol
       ├─ shares
       ├─ avgCost
       └─ currentPrice
```

Each stock belongs to a specific user via `userId` field.

---

## Important Notes

1. **JWT Token Format**: `Bearer <token>` must be in Authorization header
2. **Stock IDs**: Use MongoDB ObjectId format when updating/deleting
3. **Live Pricing**: `currentPrice` is manually updated via `PUT /api/portfolio/stocks/:id` for now
   - In Phase 3, this will be auto-updated via Python FastAPI real-time data
4. **Mock Data**: `aiPredictionAccuracy` and user stats are hardcoded for now
5. **Gains Calculation**: Automatically computed from `currentPrice` and `avgCost`
6. **Sector Data**: Defaults to "Technology" if not provided

---

## Deployment

This backend is deployed on **Railway** and accessible at:
```
https://ai-saas-backend-production-c603.up.railway.app
```

---

**Last Updated**: April 17, 2026
**Implemented By**: AI Assistant
**Status**: ✅ Phase 1 Complete & Ready for Frontend Integration

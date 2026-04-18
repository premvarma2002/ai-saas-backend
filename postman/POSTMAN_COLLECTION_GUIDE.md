# PatternPilot Postman Collection Guide

**Updated**: April 18, 2026  
**Collection File**: `PatternPilot Complete API.postman_collection.json`  
**Environment File**: `PatternPilot Local Dev.postman_environment.json`  
**Total Endpoints**: 40 APIs

---

## 📥 Installation

### Step 1: Import Collection
1. Open **Postman**
2. Click **"Import"** (top left)
3. Select **"File"** tab
4. Navigate to: `d:\Projects\full stack projects\patternpilot\ai-saas-backend\postman\`
5. Select **`PatternPilot Complete API.postman_collection.json`**
6. Click **"Import"**

### Step 2: Import Environment
1. Click **"Import"** again
2. Select **`PatternPilot Local Dev.postman_environment.json`**
3. Click **"Import"**

### Step 3: Select Environment
1. Top-right corner, click dropdown showing environment name
2. Select **"PatternPilot Local Dev"**
3. You should see variables like `{{nodeBaseUrl}}` are now active

---

## 🔑 Quick Start

### Prerequisite: Servers Running
Before testing, ensure all services are running:
```bash
# Terminal 1: Node.js (Port 3001)
cd "d:\Projects\full stack projects\patternpilot\ai-saas-backend"
npm start

# Terminal 2: Redis
docker run -p 6379:6379 redis:latest

# Terminal 3: Python (Port 3002)
cd "d:\Projects\full stack projects\patternpilot\ai-saas-python-backend"
venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 3002
```

### Authentication Flow (Do This First!)

**Step 1: Register**
- Folder: **Setup & Authentication**
- Request: **Register New User**
- Click **Send**
- Response stores: `userId`, `testEmail`

**Step 2: Login**
- Request: **Login & Get Token**
- Click **Send**
- Response stores: `accessToken`, `refreshToken` ✅

**🎯 You now have JWT token! All other requests use it.**

---

## 📋 Collection Structure

The collection is organized into 9 folders:

### 1️⃣ Setup & Authentication (5 APIs)
- Register New User
- Login & Get Token ⭐ Do this first
- Refresh Token
- Logout
- Forgot Password

### 2️⃣ User Management (6 APIs)
- Get User Profile
- Get User Stats
- Get Achievements
- Update Profile
- Change Password
- Delete Account

### 3️⃣ Portfolio Management (6 APIs)
- Get Portfolio Summary
- Get Portfolio Stocks
- Add Stock to Portfolio
- Update Stock in Portfolio
- Delete Stock from Portfolio
- Clear Portfolio

### 4️⃣ Stock Analytics (4 APIs)
- Get Portfolio Performance
- Get Portfolio Allocation
- Get Top Performers
- Get Monthly Performance

### 5️⃣ Alerts (8 APIs)
- Get Alerts
- Get Alert Stats
- Mark Alert as Read
- Mark All Alerts as Read
- Delete Alert
- Get Alert Preferences
- Update Alert Preferences
- Create Price Alert

### 6️⃣ Settings & Security (7 APIs)
- Get Settings
- Update Settings
- Get Active Sessions
- Revoke Session
- Enable 2FA
- Verify 2FA
- Disable 2FA

### 7️⃣ Billing (4 APIs)
- Get Subscription
- Get Billing History
- Change Plan
- Cancel Subscription

### 8️⃣ AI Analysis (4 APIs) - Python Backend
- Get Market Signals
- Get Predictions
- Get Analysis Summary
- Refresh Predictions

### 9️⃣ Market Data (3 APIs) - Python Backend
- Get Stock Price
- Get Candlestick Data
- Get Price Comparison

### 🔟 WebSocket Endpoints (2)
- Price Streaming WebSocket
- Alert Notifications WebSocket

---

## 🔧 Using Environment Variables

All endpoints use Postman variables:

```
{{nodeBaseUrl}}        → http://localhost:3001
{{pythonBaseUrl}}      → http://localhost:3002
{{accessToken}}        → JWT token (auto-filled after login)
{{refreshToken}}       → Refresh token (auto-filled after login)
{{userId}}             → User ID (auto-filled after register)
{{testEmail}}          → Test email (auto-filled)
{{stockId}}            → Stock ID (set when needed)
{{alertId}}            → Alert ID (set when needed)
{{sessionId}}          → Session ID (set when needed)
```

### Manually Set Variables
1. Click **"Environment"** tab
2. Select **"PatternPilot Local Dev"**
3. Edit values in the table
4. Click **"Save"**

---

## ✨ Testing Workflow

### Basic Testing (10 minutes)

```
1. Setup & Authentication
   ├─ Register New User ✅
   └─ Login & Get Token ✅ (Saves accessToken)

2. User Management
   └─ Get User Profile ✅

3. Portfolio Management
   ├─ Get Portfolio Summary ✅
   └─ Add Stock to Portfolio ✅

4. Market Data
   ├─ Get Stock Price ✅
   └─ Get Predictions ✅

5. Alerts
   └─ Get Alerts ✅
```

### Complete Testing (1 hour)

Run all 40 requests in order:
1. Do Setup & Authentication first
2. Run each folder's requests sequentially
3. Check each response in the **"Response"** tab

---

## 🧪 Advanced Features

### Pre-request Scripts
Automatically executed before each request:
- Set default values
- Generate unique emails
- Add timestamps
- Format tokens

### Test Scripts
Automatically validate responses:
- Check HTTP status codes
- Verify response structure
- Extract and store values
- Log errors

### Examples

Click any request, then:
1. **"Body"** tab → See request format
2. **"Pre-request Script"** tab → See auto-setup code
3. **"Tests"** tab → See validation logic
4. **"Response"** tab (after sending) → See actual response

---

## 🐛 Troubleshooting

### "Could not get any response"

**Problem**: Connection refused

**Solution**:
1. Check if servers are running (3001, 3002)
2. Verify Redis is running
3. Check environment variables are correct

```bash
# Test connectivity
curl http://localhost:3001/
curl http://localhost:3002/
```

### "401 Unauthorized"

**Problem**: Invalid or missing JWT token

**Solution**:
1. Run **"Login & Get Token"** request
2. Check `accessToken` is stored in environment
3. Verify Authorization header is present

### "Bearer token format error"

**Problem**: Authorization header is malformed

**Solution**:
1. Check token starts with `eyJ` (JWT signature)
2. Ensure no extra spaces in header
3. Re-login to get fresh token

### Variables Show as {{name}} Instead of Values

**Problem**: Environment not selected

**Solution**:
1. Top-right dropdown
2. Select **"PatternPilot Local Dev"**
3. Variables will now be replaced

---

## 📊 Response Format

All endpoints follow standard format:

**Success (2xx)**:
```json
{
  "status": 200,
  "message": "Success description",
  "data": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

**Error (4xx/5xx)**:
```json
{
  "status": 400,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🚀 Common Workflows

### Workflow 1: Complete Trading Scenario

```
1. Register & Login
2. Add stocks to portfolio (5 requests)
3. View portfolio summary
4. Get AI predictions
5. Create price alerts
6. View performance metrics
```

### Workflow 2: User Account Management

```
1. Login
2. View profile
3. Update profile
4. Change password
5. Enable 2FA
6. View settings
```

### Workflow 3: Real-time Data

```
1. Get current stock prices
2. Get candlestick data for multiple periods
3. Compare multiple stocks
4. Get market signals
5. Setup WebSocket connections (separate tool needed)
```

---

## 💡 Tips & Best Practices

### ✅ Do This
- Test auth flow first (Register → Login)
- Check response tab after each request
- Use environment variables instead of hardcoding
- Run requests in folders sequentially
- Save successful responses for reference

### ❌ Don't Do This
- Skip the login step
- Hardcode tokens in requests
- Use old collection files (delete them!)
- Test endpoints in random order
- Keep expired tokens

---

## 📝 Variables Reference

### Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `nodeBaseUrl` | `http://localhost:3001` | Node.js server |
| `pythonBaseUrl` | `http://localhost:3002` | Python server |
| `accessToken` | JWT | Auto-set by Login request |
| `refreshToken` | JWT | Auto-set by Login request |
| `userId` | UUID | Auto-set by Register request |
| `testEmail` | email@domain | Auto-set by Register request |
| `stockId` | UUID | Manual: from Add Stock response |
| `alertId` | UUID | Manual: from Get Alerts response |
| `sessionId` | UUID | Manual: from Get Sessions response |
| `testPassword` | `Test@1234` | Default test password |

---

## 🔗 Related Files

- **Collection**: [PatternPilot Complete API.postman_collection.json](./PatternPilot%20Complete%20API.postman_collection.json)
- **Environment**: [PatternPilot Local Dev.postman_environment.json](./PatternPilot%20Local%20Dev.postman_environment.json)
- **Testing Guide**: [TESTING_ALL_ENDPOINTS.md](../TESTING_ALL_ENDPOINTS.md)
- **API Documentation**: [API_Requirements.md](../API_Requirements.md)

---

## 🎓 Next Steps

1. ✅ Import collection and environment
2. ✅ Run authentication flow
3. ✅ Test 5-10 endpoints
4. ✅ Explore WebSocket endpoints (needs WebSocket client)
5. ✅ Integrate with frontend application

---

**Status**: ✅ Complete Collection Ready  
**Date**: April 18, 2026  
**Coverage**: 40/40 Endpoints

For API documentation, see [API_Requirements.md](../API_Requirements.md)

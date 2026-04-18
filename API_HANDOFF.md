# PatternPilot Backend API Handoff

Base URL: `https://ai-saas-backend-production-c603.up.railway.app`

This backend currently exposes one auth router under `/api/auth`.

## Importable files

- `postman/PatternPilot Auth API.postman_collection.json`
- `postman/PatternPilot Railway.postman_environment.json`

## Verified endpoints

These flows were exercised against the live Railway deployment on 2026-04-13:

- `GET /` -> `200 OK`
- `POST /api/auth/register` -> `201 Created`
- `POST /api/auth/login` -> `200 OK`
- `POST /api/auth/refresh-token` -> `200 OK`
- `POST /api/auth/logout` -> `200 OK`
- `POST /api/auth/forget-password` -> `200 OK`
- `POST /api/auth/login` with reset password -> `200 OK`

## Response shape

Successful responses use this JSON envelope:

```json
{
  "status": 200,
  "message": "...",
  "data": {}
}
```

Error responses use this JSON envelope:

```json
{
  "status": 400,
  "message": "...",
  "error": {}
}
```

## Endpoint summary

### Register

`POST /api/auth/register`

Body:

```json
{
  "name": "Frontend Dev Test",
  "email": "user@example.com",
  "password": "TempPass123!"
}
```

Success returns user metadata:

```json
{
  "status": 201,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "name": "Frontend Dev Test",
    "email": "user@example.com",
    "plan": "free",
    "role": "user"
  }
}
```

### Login

`POST /api/auth/login`

Body:

```json
{
  "email": "user@example.com",
  "password": "TempPass123!"
}
```

Success returns user data plus tokens:

```json
{
  "status": 200,
  "message": "User logged in successfully",
  "data": {
    "id": "...",
    "name": "Frontend Dev Test",
    "email": "user@example.com",
    "plan": "free",
    "role": "user",
    "token": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

### Refresh Token

`POST /api/auth/refresh-token`

Body:

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Success returns a new access token:

```json
{
  "status": 200,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new-jwt-access-token"
  }
}
```

### Forget Password

`POST /api/auth/forget-password`

Body:

```json
{
  "email": "user@example.com",
  "newPassword": "ResetPass123!"
}
```

### Logout

`POST /api/auth/logout`

Body:

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

## Postman run order

Recommended order if you want to test the full lifecycle:

1. `Health Check`
2. `Register`
3. `Login`
4. `Refresh Token`
5. `Forget Password`
6. `Login After Reset`
7. `Logout`
8. `Refresh After Logout`

## Notes for frontend integration

- All auth routes are prefixed with `/api/auth`.
- Login is the only route that returns both `token` and `refreshToken`.
- Refresh returns only a new access token, not a new refresh token.
- Logout expects the refresh token in the request body.
- The Postman `Register` request auto-generates a unique email so the collection can be run repeatedly without manual edits.
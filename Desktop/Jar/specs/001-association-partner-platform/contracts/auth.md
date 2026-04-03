# API Contracts: Authentication

**Base Path**: `/api/auth`

## POST /api/auth/[...nextauth]

Handled by NextAuth.js. Provides:

- `POST /api/auth/signin` — Login with credentials
- `POST /api/auth/signout` — Logout
- `GET /api/auth/session` — Get current session

## POST /api/auth/register

Register a new user account.

**Request Body**:
```json
{
  "email": "manager@example.com",
  "password": "securePassword123",
  "name": "Ahmed Al-Mansour",
  "phone": "+966501234567",
  "role": "manager",
  "associationData": {
    "name": "Al-Nakheel Owners Association",
    "registrationNumber": "OA-2024-001",
    "address": { "street": "...", "city": "Riyadh", "region": "Riyadh", "postalCode": "12345", "country": "SA" },
    "memberCount": 120
  }
}
```

**Response 201**:
```json
{
  "success": true,
  "user": { "id": "...", "email": "...", "name": "...", "role": "manager" },
  "message": "Account created successfully"
}
```

**Response 400**: Validation errors  
**Response 409**: Email already registered

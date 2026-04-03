# API Contracts: Service Requests

**Base Path**: `/api/requests`  
**Auth Required**: Yes (all endpoints)

## GET /api/requests

List service requests for the authenticated user's context.

**Query Parameters**:
- `status` — Filter by status (comma-separated)
- `category` — Filter by service category
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20, max: 100)
- `sort` — Sort field (default: `-createdAt`)

**Response 200**:
```json
{
  "requests": [{ "id": "...", "requestNumber": "SR-00001", "status": "submitted", ... }],
  "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
}
```

**Role-based filtering**:
- Manager: sees requests from their association
- Partner: sees requests assigned to them
- Admin: sees all requests

## POST /api/requests

Create a new service request. **Role**: Manager only.

**Request Body**:
```json
{
  "partnerId": "ObjectId",
  "description": "Annual elevator maintenance inspection required",
  "location": "Building A, Al-Nakheel Compound",
  "serviceCategory": "maintenance",
  "urgencyLevel": "medium",
  "preferredSchedule": { "startDate": "2026-04-15", "endDate": "2026-04-20" }
}
```

**Response 201**: Created request object with `requestNumber`  
**Response 400**: Validation errors  
**Response 403**: Not a manager role

## GET /api/requests/[id]

Get single request details with populated partner and association data.

**Response 200**: Full request object with populated references  
**Response 404**: Request not found  
**Response 403**: No access to this request

## PATCH /api/requests/[id]

Update request status or partner response.

**Request Body** (partner responding):
```json
{
  "partnerResponse": {
    "action": "accepted",
    "note": "Available, will start April 16",
    "proposedSchedule": { "startDate": "2026-04-16", "endDate": "2026-04-18" }
  }
}
```

**Request Body** (status update):
```json
{
  "status": "in_progress",
  "note": "Work commenced on site"
}
```

**Response 200**: Updated request  
**Response 400**: Invalid state transition  
**Response 403**: Not authorized for this action

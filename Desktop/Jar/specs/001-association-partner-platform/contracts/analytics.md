# API Contracts: Analytics & Predictions

**Base Path**: `/api/analytics`  
**Auth Required**: Yes (all endpoints)

## GET /api/analytics

Get analytics data for the authenticated user's association or partner context.

**Query Parameters**:
- `period` — Time period: `3m`, `6m`, `1y`, `all` (default: `6m`)
- `type` — Data type: `spending`, `frequency`, `performance`, `all` (default: `all`)

**Response 200**:
```json
{
  "spending": {
    "byCategory": [{ "category": "maintenance", "total": 45000, "count": 12 }],
    "byMonth": [{ "month": "2026-01", "total": 8000 }],
    "totalSpend": 120000
  },
  "frequency": {
    "byCategory": [{ "category": "maintenance", "count": 15, "avgInterval": 45 }],
    "byMonth": [{ "month": "2026-01", "count": 3 }]
  },
  "performance": {
    "topPartners": [{ "partnerId": "...", "businessName": "...", "avgRating": 4.8, "completedRequests": 8 }],
    "avgResponseTime": 18,
    "completionRate": 0.94
  }
}
```

## GET /api/analytics/predictions

Get predictive maintenance alerts for the authenticated user's association.

**Response 200**:
```json
{
  "predictions": [
    {
      "id": "...",
      "serviceCategory": "maintenance",
      "predictedDate": "2026-05-15",
      "confidence": "high",
      "suggestedPartners": [{ "id": "...", "businessName": "...", "aggregateRating": 4.7 }],
      "averageInterval": 90,
      "dataPointCount": 8,
      "status": "active"
    }
  ]
}
```

## POST /api/analytics/predictions/generate

Trigger prediction generation for an association. **Role**: Manager or System (cron).

**Request Body**:
```json
{ "associationId": "ObjectId" }
```

**Response 200**: `{ "generated": 3, "predictions": [...] }`

## PATCH /api/analytics/predictions/[id]

Update prediction status. **Role**: Manager.

**Request Body**:
```json
{ "status": "acted_on" }
```

**Response 200**: Updated prediction

# API Contracts: Quality Reviews

**Base Path**: `/api/reviews`  
**Auth Required**: Yes (all endpoints)

## GET /api/reviews

List reviews. Filterable by partner or association context.

**Query Parameters**:
- `partnerId` — Filter by partner
- `page`, `limit`, `sort` — Pagination (default sort: `-createdAt`)

**Response 200**:
```json
{
  "reviews": [{ "id": "...", "overallScore": 4.2, "ratings": { "timeliness": 4, "quality": 5, "communication": 4, "value": 4 }, ... }],
  "pagination": { ... }
}
```

## POST /api/reviews

Submit a quality review. **Role**: Manager only. One review per service request.

**Request Body**:
```json
{
  "serviceRequestId": "ObjectId",
  "ratings": { "timeliness": 4, "quality": 5, "communication": 4, "value": 4 },
  "comments": "Excellent work, completed ahead of schedule."
}
```

**Response 201**: Created review with calculated `overallScore`  
**Response 400**: Validation errors, request not completed, or review already exists  
**Side effects**: Updates `partners.aggregateRating` and `partners.totalReviews`

## PATCH /api/reviews/[id]

Add partner response to a review. **Role**: Partner only.

**Request Body**:
```json
{ "partnerResponse": "Thank you for the positive feedback!" }
```

**Response 200**: Updated review

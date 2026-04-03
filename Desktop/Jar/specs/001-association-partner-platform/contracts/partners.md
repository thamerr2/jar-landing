# API Contracts: Partners

**Base Path**: `/api/partners`  
**Auth Required**: Partial (directory is public; management requires auth)

## GET /api/partners

Search and filter the partner directory. Public access (no auth required for basic listing).

**Query Parameters**:
- `q` — Text search (business name, description)
- `category` — Service category filter (comma-separated)
- `area` — Service area filter
- `availability` — Availability filter
- `minRating` — Minimum aggregate rating
- `status` — Accreditation status (default: "approved" for public; admin can see all)
- `page`, `limit`, `sort` — Pagination (default sort: `-aggregateRating`)

**Response 200**:
```json
{
  "partners": [{ "id": "...", "businessName": "...", "aggregateRating": 4.5, "serviceCategories": ["maintenance"], ... }],
  "facets": { "categories": [{ "name": "maintenance", "count": 45 }], "areas": [...] },
  "pagination": { ... }
}
```

## GET /api/partners/[id]

Get full partner profile with recent reviews.

**Response 200**: Partner object + latest 5 reviews + service statistics

## PATCH /api/partners/[id]

Update partner profile. **Role**: Partner (own profile) or Admin.

**Request Body**:
```json
{
  "availability": "available",
  "serviceAreas": ["Riyadh", "Jeddah"],
  "description": "Updated business description"
}
```

## POST /api/admin/accreditation

Admin accreditation action. **Role**: Admin only.

**Request Body**:
```json
{
  "partnerId": "ObjectId",
  "action": "approve",
  "reason": "All documentation verified"
}
```

**Valid actions**: `approve`, `suspend`, `revoke`, `reactivate`  
**Side effects**: Updates partner `accreditationStatus`, appends to `accreditationHistory`, sends notification to partner

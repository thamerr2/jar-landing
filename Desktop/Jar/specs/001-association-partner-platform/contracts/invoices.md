# API Contracts: Invoices & Billing

**Base Path**: `/api/invoices`  
**Auth Required**: Yes (all endpoints)

## GET /api/invoices

List invoices for the authenticated user's context.

**Query Parameters**:
- `paymentStatus` — Filter by status (comma-separated)
- `dateFrom`, `dateTo` — Date range filter
- `partnerId` — Filter by partner
- `page`, `limit`, `sort` — Pagination

**Response 200**:
```json
{
  "invoices": [{ "id": "...", "invoiceNumber": "INV-00001", "totalAmount": 5000, "paymentStatus": "pending", ... }],
  "summary": { "totalPending": 15000, "totalPaid": 48000, "totalOverdue": 3000 },
  "pagination": { "page": 1, "limit": 20, "total": 32, "pages": 2 }
}
```

## POST /api/invoices

Create a new invoice. **Role**: Partner only.

**Request Body**:
```json
{
  "serviceRequestId": "ObjectId",
  "lineItems": [
    { "description": "Elevator inspection", "quantity": 1, "unitPrice": 3000 },
    { "description": "Parts replacement", "quantity": 2, "unitPrice": 500 }
  ],
  "dueDate": "2026-05-15"
}
```

**Response 201**: Created invoice with auto-calculated `totalAmount`  
**Response 400**: Validation errors or service request not completed

## PATCH /api/invoices/[id]

Update invoice status. **Roles**: Manager (approve), System (mark overdue/paid).

**Request Body**:
```json
{ "paymentStatus": "approved" }
```

**Response 200**: Updated invoice  
**Response 400**: Invalid status transition

## GET /api/invoices/[id]/export

Export single invoice as PDF or CSV.

**Query Parameters**: `format=pdf|csv`  
**Response**: File download with appropriate Content-Type

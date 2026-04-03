# Data Model: Association Partner Platform

**Date**: 2026-03-30  
**Feature**: 001-association-partner-platform  
**Database**: MongoDB (via Mongoose ODM)

## Collections & Schemas

### users

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| _id | ObjectId | MongoDB auto-generated ID | Primary key |
| email | String | Login email | Required, unique, lowercase, trimmed, valid email |
| passwordHash | String | bcrypt-hashed password | Required |
| name | String | Full name | Required, maxlength 100 |
| phone | String | Phone number | Optional |
| role | String | Platform role | Required, enum: ["manager", "partner", "admin"] |
| associationId | ObjectId | Linked association | Required if role=manager, ref: associations |
| partnerId | ObjectId | Linked partner org | Required if role=partner, ref: partners |
| isActive | Boolean | Account active status | Default: true |
| lastLogin | Date | Last login timestamp | Auto-updated |
| createdAt | Date | Registration timestamp | Auto (timestamps: true) |
| updatedAt | Date | Last update timestamp | Auto (timestamps: true) |

**Indexes**: `{ email: 1 }` (unique), `{ role: 1 }`, `{ associationId: 1 }`, `{ partnerId: 1 }`

---

### associations

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| _id | ObjectId | MongoDB auto-generated ID | Primary key |
| name | String | Association name | Required, maxlength 200 |
| registrationNumber | String | Official registration number | Required, unique |
| address | Object | Full address | Required. Sub-fields: { street, city, region, postalCode, country } |
| primaryContactId | ObjectId | Primary manager | Required, ref: users |
| memberCount | Number | Number of members/units | Required, min 1 |
| subscriptionTier | String | Subscription level | enum: ["basic", "standard", "premium"], default: "basic" |
| createdAt | Date | Creation timestamp | Auto |
| updatedAt | Date | Last update timestamp | Auto |

**Indexes**: `{ registrationNumber: 1 }` (unique), `{ name: "text" }` (text search)

---

### partners (FieldPartner)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| _id | ObjectId | MongoDB auto-generated ID | Primary key |
| businessName | String | Company name | Required, maxlength 200 |
| registrationNumber | String | Business registration number | Required, unique |
| accreditationStatus | String | Current state | Required, enum: ["pending", "under_review", "approved", "suspended", "revoked"], default: "pending" |
| serviceCategories | [String] | Services offered | Required, min 1. Enum values: ["maintenance", "vision", "policy", "inspection", "cleaning", "security", "landscaping", "consulting", "other"] |
| serviceAreas | [String] | Geographic coverage | Required, min 1 |
| certifications | [String] | Professional certifications | Optional |
| aggregateRating | Number | Weighted average rating | Default: 0, min 0, max 5 |
| totalReviews | Number | Total review count | Default: 0 |
| availability | String | Current availability | enum: ["available", "busy", "unavailable"], default: "available" |
| pricingModel | String | Charging method | enum: ["hourly", "fixed", "quoted"] |
| description | String | Business description | Required, maxlength 1000 |
| accreditationHistory | [Object] | Status change log | Array of { status, changedBy: ObjectId, reason, date } |
| createdAt | Date | Registration timestamp | Auto |
| updatedAt | Date | Last update timestamp | Auto |

**Indexes**: `{ registrationNumber: 1 }` (unique), `{ accreditationStatus: 1 }`, `{ serviceCategories: 1 }`, `{ serviceAreas: 1 }`, `{ aggregateRating: -1 }`, `{ businessName: "text", description: "text" }` (text search)

---

### servicerequests

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| _id | ObjectId | MongoDB auto-generated ID | Primary key |
| requestNumber | String | Human-readable ID | Auto-generated, format: "SR-XXXXX", unique |
| associationId | ObjectId | Requesting association | Required, ref: associations |
| partnerId | ObjectId | Assigned partner | Required, ref: partners |
| managerId | ObjectId | Submitting manager | Required, ref: users |
| description | String | Work description | Required, maxlength 2000 |
| location | String | Work location/address | Required |
| serviceCategory | String | Category of work | Required, must match partner's serviceCategories |
| urgencyLevel | String | Priority level | Required, enum: ["low", "medium", "high", "critical"] |
| preferredSchedule | Object | Preferred timing | { startDate: Date, endDate: Date } |
| status | String | Lifecycle status | Required, enum: ["submitted", "accepted", "in_progress", "completed", "cancelled", "disputed"], default: "submitted" |
| partnerResponse | Object | Partner's response | { action: enum ["accepted", "declined", "counter"], note: String, proposedSchedule: { startDate, endDate }, respondedAt: Date } |
| costEstimate | Number | Estimated cost | Optional, min 0 |
| finalCost | Number | Actual cost | Optional, min 0 |
| statusHistory | [Object] | Audit trail | Array of { status, changedBy: ObjectId, note, date } |
| completedAt | Date | Completion timestamp | Set when status=completed |
| createdAt | Date | Submission timestamp | Auto |
| updatedAt | Date | Last update timestamp | Auto |

**Indexes**: `{ requestNumber: 1 }` (unique), `{ associationId: 1, status: 1 }`, `{ partnerId: 1, status: 1 }`, `{ status: 1 }`, `{ serviceCategory: 1 }`, `{ createdAt: -1 }`

**State Transitions**:
```
submitted → accepted (partner accepts)
submitted → declined (partner declines — request returns to pool or manager picks new partner)
submitted → cancelled (manager cancels)
accepted → in_progress (work begins)
accepted → cancelled (manager cancels)
in_progress → completed (work finished)
in_progress → disputed (dispute raised)
completed → disputed (post-completion dispute)
disputed → completed (resolved in partner's favor)
disputed → cancelled (resolved, invoice voided)
```

---

### invoices

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| _id | ObjectId | MongoDB auto-generated ID | Primary key |
| invoiceNumber | String | Human-readable ID | Auto-generated, format: "INV-XXXXX", unique |
| serviceRequestId | ObjectId | Associated request | Required, ref: servicerequests |
| partnerId | ObjectId | Invoice issuer | Required, ref: partners |
| associationId | ObjectId | Invoice recipient | Required, ref: associations |
| lineItems | [Object] | Itemized charges | Required, min 1. Each: { description: String, quantity: Number, unitPrice: Number, total: Number } |
| totalAmount | Number | Invoice total | Required, calculated from lineItems |
| currency | String | Currency code | Default: "SAR" |
| dueDate | Date | Payment due date | Required |
| paymentStatus | String | Current status | Required, enum: ["pending", "approved", "paid", "overdue", "on_hold", "voided"], default: "pending" |
| approvedAt | Date | Approval timestamp | Set when approved |
| paidAt | Date | Payment timestamp | Set when paid |
| createdAt | Date | Submission timestamp | Auto |
| updatedAt | Date | Last update timestamp | Auto |

**Indexes**: `{ invoiceNumber: 1 }` (unique), `{ associationId: 1, paymentStatus: 1 }`, `{ partnerId: 1 }`, `{ paymentStatus: 1 }`, `{ dueDate: 1 }`

---

### qualityreviews

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| _id | ObjectId | MongoDB auto-generated ID | Primary key |
| serviceRequestId | ObjectId | Reviewed request | Required, ref: servicerequests, unique |
| partnerId | ObjectId | Reviewed partner | Required, ref: partners |
| managerId | ObjectId | Reviewing manager | Required, ref: users |
| ratings | Object | Structured scores | Required. { timeliness: 1-5, quality: 1-5, communication: 1-5, value: 1-5 } |
| overallScore | Number | Weighted average | Calculated, min 1, max 5 |
| comments | String | Written review | Optional, maxlength 1000 |
| partnerResponse | String | Partner's reply | Optional, maxlength 500 |
| createdAt | Date | Submission timestamp | Auto |

**Indexes**: `{ serviceRequestId: 1 }` (unique), `{ partnerId: 1, createdAt: -1 }`, `{ overallScore: -1 }`

**Post-save middleware**: Recalculate `partners.aggregateRating` and `partners.totalReviews` after each review save.

---

### predictivealerts

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| _id | ObjectId | MongoDB auto-generated ID | Primary key |
| associationId | ObjectId | Target association | Required, ref: associations |
| serviceCategory | String | Predicted service type | Required |
| predictedDate | Date | Recommended scheduling window | Required |
| confidence | String | Prediction confidence | Required, enum: ["high", "medium"] |
| suggestedPartnerIds | [ObjectId] | Recommended partners | ref: partners |
| averageInterval | Number | Average days between past services | Required |
| dataPointCount | Number | Historical data points used | Required, min 3 |
| status | String | Alert status | enum: ["active", "acted_on", "dismissed", "expired"], default: "active" |
| createdAt | Date | Generation timestamp | Auto |

**Indexes**: `{ associationId: 1, status: 1 }`, `{ predictedDate: 1 }`, `{ status: 1 }`

---

### notifications

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| _id | ObjectId | MongoDB auto-generated ID | Primary key |
| userId | ObjectId | Recipient | Required, ref: users |
| type | String | Category | Required, enum: ["request", "invoice", "payment", "review", "accreditation", "prediction", "dispute", "system"] |
| title | String | Short title | Required, maxlength 100 |
| message | String | Body text | Required, maxlength 500 |
| referenceType | String | Type of linked entity | Optional, enum: ["servicerequest", "invoice", "review", "partner", "dispute"] |
| referenceId | ObjectId | Linked entity ID | Optional |
| isRead | Boolean | Read status | Default: false |
| createdAt | Date | Creation timestamp | Auto |

**Indexes**: `{ userId: 1, isRead: 1, createdAt: -1 }`, `{ createdAt: 1, expireAfterSeconds: 7776000 }` (TTL: 90 days)

---

### disputes

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| _id | ObjectId | MongoDB auto-generated ID | Primary key |
| invoiceId | ObjectId | Contested invoice | Required, ref: invoices |
| serviceRequestId | ObjectId | Related request | Required, ref: servicerequests |
| initiatedBy | ObjectId | User who opened dispute | Required, ref: users |
| reason | String | Dispute reason | Required, maxlength 1000 |
| evidence | [Object] | Supporting documents | Optional. Array of { description: String, uploadedBy: ObjectId, date: Date } |
| status | String | Resolution status | Required, enum: ["open", "under_review", "resolved"], default: "open" |
| resolution | Object | Admin decision | Optional. { decision: enum ["full_payment", "partial_payment", "voided"], amount: Number, note: String, resolvedBy: ObjectId } |
| resolvedAt | Date | Resolution timestamp | Set on resolution |
| createdAt | Date | Dispute opened timestamp | Auto |
| updatedAt | Date | Last update timestamp | Auto |

**Indexes**: `{ invoiceId: 1 }`, `{ status: 1 }`, `{ createdAt: -1 }`

**Pre-save middleware**: When dispute is created, set associated invoice `paymentStatus` to `"on_hold"`.

## Relationships Diagram

```
associations  1 ←→ N  users (role=manager)
partners      1 ←→ 1  users (role=partner)
associations  1 ←→ N  servicerequests
partners      1 ←→ N  servicerequests
servicerequests 1 ←→ 0..1  invoices
servicerequests 1 ←→ 0..1  qualityreviews
invoices      1 ←→ 0..1  disputes
associations  1 ←→ N  predictivealerts
users         1 ←→ N  notifications
```

## Aggregation Pipelines (for Analytics)

- **Spending by Category**: Group invoices by serviceCategory (via servicerequest join), sum totalAmount, group by month.
- **Partner Performance**: Group reviews by partnerId, calculate average overallScore, count total, group by month.
- **Service Frequency**: Group servicerequests by serviceCategory and month, count per period.
- **Predictive Maintenance**: Group completed servicerequests by associationId + serviceCategory, calculate date intervals, project next predicted date.

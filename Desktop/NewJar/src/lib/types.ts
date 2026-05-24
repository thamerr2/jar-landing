export interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "owner" | "tenant" | "contractor" | "union_admin";
  phone?: string | null;
  avatar?: string | null;
  active: boolean;
  verified: boolean;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  ownerId: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor: number;
  tenantId: string | null;
  property?: Property;
}

export interface Contractor {
  id: string;
  userId: string;
  companyName: string;
  specializations: string[];
  rating: number;
  hourlyRate: number;
  city: string;
  user?: { name: string; email: string; phone?: string | null };
}

export type RequestStatus =
  | "submitted"
  | "assigned"
  | "in_progress"
  | "completed"
  | "under_review"
  | "closed";

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  category: string;
  urgency: "low" | "medium" | "high" | "emergency";
  unitId: string;
  propertyId: string;
  submittedById: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  unit?: { unitNumber: string; propertyId: string };
  property?: Property;
  contractor?: Contractor;
  submitter?: { name: string; email: string };
  photos?: string[];
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "escrow" | "released" | "refunded" | "failed";
  type: string;
  userId: string;
  maintenanceRequestId: string | null;
  hyperpayCheckoutId: string | null;
  createdAt: string;
  request?: { title: string };
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  authorId: string;
  propertyId: string | null;
  createdAt: string;
  author?: { name: string };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

import { Express } from "express";
import authRouter from "./auth.js";
import propertiesRouter from "./properties.js";
import unitsRouter from "./units.js";
import leasesRouter from "./leases.js";
import contractorsRouter from "./contractors.js";
import maintenanceRouter from "./maintenance.js";
import quotesRouter from "./quotes.js";
import paymentsRouter from "./payments.js";
import notificationsRouter from "./notifications.js";
import commentsRouter from "./comments.js";
import uploadRouter from "./upload.js";
import dashboardRouter from "./dashboard.js";
import stripeRouter from "./stripe.js";
import adminRouter from "./admin.js";
import systemRouter from "./system.js";

export function registerRoutes(app: Express): void {
  app.use("/api/auth", authRouter);
  app.use("/api/properties", propertiesRouter);
  app.use("/api/units", unitsRouter);
  app.use("/api/leases", leasesRouter);
  app.use("/api/contractors", contractorsRouter);
  app.use("/api/maintenance-requests", maintenanceRouter);
  app.use("/api/maintenance", maintenanceRouter);
  app.use("/api/quotes", quotesRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/notifications", notificationsRouter);
  app.use("/api/comments", commentsRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/stripe", stripeRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/system-messages", systemRouter);
  app.use("/api/health", systemRouter);
}

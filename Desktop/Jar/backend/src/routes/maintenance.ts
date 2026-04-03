import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import * as storage from "../services/storage.js";

const router = Router();
router.use(authenticateToken);

router.get("/stats", async (req, res, next) => {
  try {
    const role = req.user!.role;
    const userId = req.user!.id;

    let filters: Parameters<typeof storage.getMaintenanceStats>[0] = {};

    if (role === "tenant") {
      filters.createdById = userId;
    } else if (role === "contractor") {
      const contractor = await storage.getContractorByUserId(userId);
      if (contractor) filters.assignedToContractorId = contractor.id;
    } else if (role === "owner") {
      const props = await storage.getProperties(userId);
      if (props.length > 0) {
        const allUnits = await Promise.all(props.map(p => storage.getUnits(p.id)));
        filters.unitIds = allUnits.flat().map(u => u.id);
      }
    }

    const stats = await storage.getMaintenanceStats(filters);
    res.json(stats);
  } catch (error) { next(error); }
});

router.get("/", async (req, res, next) => {
  try {
    const role = req.user!.role;
    const userId = req.user!.id;

    let filters: Parameters<typeof storage.getMaintenanceRequests>[0] = {};

    if (req.query.status) filters.status = req.query.status as string;

    if (role === "tenant") {
      filters.createdById = userId;
    } else if (role === "contractor") {
      const contractor = await storage.getContractorByUserId(userId);
      if (contractor) filters.assignedToContractorId = contractor.id;
    } else if (role === "owner") {
      const props = await storage.getProperties(userId);
      if (props.length > 0) {
        const allUnits = await Promise.all(props.map(p => storage.getUnits(p.id)));
        filters.unitIds = allUnits.flat().map(u => u.id);
      } else {
        res.json([]);
        return;
      }
    }

    const result = await storage.getMaintenanceRequests(filters);
    res.json(result);
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const req_ = await storage.getMaintenanceRequest(req.params.id);
    if (!req_) { res.status(404).json({ message: "Maintenance request not found" }); return; }
    res.json(req_);
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      createdById: req.user!.id,
      scheduledDate: req.body.scheduledDate ? new Date(req.body.scheduledDate) : null
    };
    const created = await storage.createMaintenanceRequest(data);

    // Notify property owner
    try {
      const unit = await storage.getUnit(created.unitId);
      if (unit) {
        const props = await storage.getProperties();
        const prop = props.find(p => p.id === unit.propertyId);
        if (prop) {
          await storage.createNotification({
            userId: prop.ownerId,
            type: "maintenance_created",
            title: "New Maintenance Request",
            message: `A new maintenance request has been submitted: ${created.title}`,
            link: `/maintenance/${created.id}`,
            read: false
          });
        }
      }
    } catch { /* notification failure is non-critical */ }

    res.status(201).json(created);
  } catch (error) { next(error); }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const existing = await storage.getMaintenanceRequest(req.params.id);
    if (!existing) { res.status(404).json({ message: "Maintenance request not found" }); return; }

    const data = { ...req.body };
    if (data.scheduledDate) data.scheduledDate = new Date(data.scheduledDate);
    if (data.status === "completed" && !data.completedAt) data.completedAt = new Date();
    if (data.status === "closed" && !data.closedAt) data.closedAt = new Date();

    const updated = await storage.updateMaintenanceRequest(req.params.id, data);

    // Notify on status change
    if (data.status && data.status !== existing.status) {
      try {
        await storage.createNotification({
          userId: existing.createdById,
          type: "maintenance_updated",
          title: "Maintenance Request Updated",
          message: `Your request "${existing.title}" status changed to ${data.status}`,
          link: `/maintenance/${existing.id}`,
          read: false
        });
      } catch { /* non-critical */ }
    }

    res.json(updated);
  } catch (error) { next(error); }
});

export default router;

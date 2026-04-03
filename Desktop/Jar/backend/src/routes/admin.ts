import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import * as storage from "../services/storage.js";

const router = Router();
router.use(authenticateToken, requireRole("super_admin"));

router.get("/stats", async (_req, res, next) => {
  try {
    const stats = await storage.getAdminStats();
    res.json(stats);
  } catch (error) { next(error); }
});

router.get("/users", async (req, res, next) => {
  try {
    const filters: Parameters<typeof storage.getAllUsers>[0] = {};
    if (req.query.role) filters.role = req.query.role as string;
    if (req.query.active !== undefined) filters.active = req.query.active === "true";
    if (req.query.search) filters.search = req.query.search as string;
    const users = await storage.getAllUsers(filters);
    res.json(users.map(({ password: _pw, ...u }) => u));
  } catch (error) { next(error); }
});

router.patch("/users/:id/activate", async (req, res, next) => {
  try {
    await storage.activateUser(req.params.id);
    await storage.createActivityLog({
      userId: req.user!.id,
      userEmail: undefined,
      userRole: req.user!.role,
      action: "user_activated",
      entityType: "user",
      entityId: req.params.id
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.patch("/users/:id/deactivate", async (req, res, next) => {
  try {
    await storage.deactivateUser(req.params.id);
    await storage.createActivityLog({
      userId: req.user!.id,
      userEmail: undefined,
      userRole: req.user!.role,
      action: "user_deactivated",
      entityType: "user",
      entityId: req.params.id
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.patch("/users/:id/role", async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) { res.status(400).json({ message: "Role is required" }); return; }
    await storage.updateUser(req.params.id, { role });
    await storage.createActivityLog({
      userId: req.user!.id,
      userEmail: undefined,
      userRole: req.user!.role,
      action: "user_updated",
      entityType: "user",
      entityId: req.params.id,
      details: `Role changed to ${role}`
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    if (req.params.id === req.user!.id) {
      res.status(400).json({ message: "Cannot delete your own account" });
      return;
    }
    await storage.deleteUser(req.params.id);
    await storage.createActivityLog({
      userId: req.user!.id,
      userEmail: undefined,
      userRole: req.user!.role,
      action: "user_deleted",
      entityType: "user",
      entityId: req.params.id
    });
    res.status(204).send();
  } catch (error) { next(error); }
});

router.get("/activity-logs", async (req, res, next) => {
  try {
    const filters: Parameters<typeof storage.getActivityLogs>[0] = {};
    if (req.query.userId) filters.userId = req.query.userId as string;
    if (req.query.action) filters.action = req.query.action as string;
    if (req.query.limit) filters.limit = parseInt(req.query.limit as string);
    const logs = await storage.getActivityLogs(filters);
    res.json(logs);
  } catch (error) { next(error); }
});

router.get("/settings", async (_req, res, next) => {
  try {
    const settings = await storage.getSystemSettings();
    res.json(settings);
  } catch (error) { next(error); }
});

router.put("/settings/:key", async (req, res, next) => {
  try {
    const setting = await storage.upsertSystemSetting({
      key: req.params.key,
      value: req.body.value,
      description: req.body.description,
      updatedById: req.user!.id
    });
    res.json(setting);
  } catch (error) { next(error); }
});

router.get("/failed-logins", async (_req, res, next) => {
  try {
    const result = await storage.getFailedLogins();
    res.json(result);
  } catch (error) { next(error); }
});

router.patch("/failed-logins/:id/resolve", async (req, res, next) => {
  try {
    await storage.resolveFailedLogin(req.params.id);
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.post("/failed-logins/resolve-all", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) { res.status(400).json({ message: "Email is required" }); return; }
    await storage.resolveAllFailedLogins(email);
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.get("/messages", async (_req, res, next) => {
  try {
    const msgs = await storage.getSystemMessages();
    res.json(msgs);
  } catch (error) { next(error); }
});

router.post("/messages", async (req, res, next) => {
  try {
    const msg = await storage.createSystemMessage({ ...req.body, createdById: req.user!.id });
    res.status(201).json(msg);
  } catch (error) { next(error); }
});

router.patch("/messages/:id", async (req, res, next) => {
  try {
    const msg = await storage.updateSystemMessage(req.params.id, req.body);
    if (!msg) { res.status(404).json({ message: "Message not found" }); return; }
    res.json(msg);
  } catch (error) { next(error); }
});

router.delete("/messages/:id", async (req, res, next) => {
  try {
    await storage.deleteSystemMessage(req.params.id);
    res.status(204).send();
  } catch (error) { next(error); }
});

export default router;

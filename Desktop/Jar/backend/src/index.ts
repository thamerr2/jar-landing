import "dotenv/config";
import http from "http";
import app from "./app.js";

const PORT = parseInt(process.env.PORT || "5001");
const HOST = "0.0.0.0";

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`[server] Jar API running on http://${HOST}:${PORT}`);
  console.log(`[server] Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`[server] Database: ${process.env.DATABASE_URL ? "configured" : "NOT configured"}`);
  console.log(`[server] Stripe: ${process.env.STRIPE_SECRET_KEY ? "configured" : "not configured"}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[server] Port ${PORT} is already in use`);
    process.exit(1);
  }
  throw err;
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("[server] Server closed");
    process.exit(0);
  });
});

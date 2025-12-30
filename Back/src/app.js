import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { cacheAndDedupe, CACHE_CONTROL_VALUE } from "./middleware/cacheAndDedupe.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import dealRoutes from "./routes/deals.js";
import statsRoutes from "./routes/stats.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json({ limit: "3mb" }));

app.use((req, res, next) => {
  if (req.method === "GET" && !res.getHeader("Cache-Control")) {
    res.setHeader("Cache-Control", CACHE_CONTROL_VALUE);
  }
  next();
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  // Heavy endpoints are handled earlier with stricter limits.
});

const heavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});

// Apply heavy protections before routing to expensive endpoints.
app.use("/api/deals", cacheAndDedupe, heavyLimiter, dealRoutes);
app.use("/api/stats", cacheAndDedupe, heavyLimiter, statsRoutes);

// General limiter for remaining API traffic.
app.use("/api/auth", generalLimiter, authRoutes);
app.use("/api/users", generalLimiter, userRoutes);
app.get("/api/health", generalLimiter, (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
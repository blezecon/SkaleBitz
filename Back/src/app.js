import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
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
app.set("etag", "strong");

app.use((req, res, next) => {
  if (req.method === "GET" && !res.getHeader("Cache-Control")) {
    res.setHeader("Cache-Control", CACHE_CONTROL_VALUE);
  }
  next();
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  // Heavy endpoints are handled earlier with stricter limits.
});

const heavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
});

app.use("/api", apiLimiter);

// Apply heavy protections before routing to expensive endpoints.
app.use("/api/deals", cacheAndDedupe, heavyLimiter, dealRoutes);
app.use("/api/stats", cacheAndDedupe, heavyLimiter, statsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;

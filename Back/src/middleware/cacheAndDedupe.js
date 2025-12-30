import crypto from "crypto";

const CACHE_TTL_MS = 30 * 1000;
const CLEANUP_BUFFER_MS = 1000;
const MAX_CACHE_ENTRIES = 500;
const CACHEABLE_ERROR_CODES = [404];
const CACHE_CONTROL_HEADER = "private, max-age=30";
const responseCache = new Map();
const inFlight = new Map();

const CACHEABLE_PATTERNS = [
  /^\/api\/deals\/?$/i,
  /^\/api\/deals\/[^/]+\/?$/i,
  /^\/api\/deals\/[^/]+\/cashflows\/?$/i,
  /^\/api\/stats\b/i,
];

const normalizedPath = (req) => (req.originalUrl || req.url || "").split("?")[0];

const hashToken = (value) => {
  if (!value) return null;
  return crypto.createHash("sha256").update(value).digest("hex");
};

const buildCacheKey = (req) => {
  const authHeader = req.headers?.authorization || "";
  const bearerToken = authHeader.replace(/^Bearer\s+/i, "");
  const authFragment =
    req.user?.id || (bearerToken ? hashToken(bearerToken) : null) || "anon";
  const url = req.originalUrl || req.url || "";
  const clientFragment = authFragment === "anon" ? "anon" : `auth:${authFragment}`;
  return `${req.method}:${url}:id:${clientFragment}`;
};

const shouldCache = (req) => {
  if (req.method !== "GET") return false;
  const path = normalizedPath(req);
  return CACHEABLE_PATTERNS.some((pattern) => pattern.test(path));
};

const normalizePayload = (body) => {
  if (Buffer.isBuffer(body)) return body;
  if (typeof body === "string") return Buffer.from(body);
  return Buffer.from(JSON.stringify(body ?? {}));
};

const applyCachedResponse = (req, res, entry) => {
  if (
    req?.headers?.["if-none-match"] &&
    entry.etag &&
    req.headers["if-none-match"].includes(entry.etag)
  ) {
    res.status(304).end();
    return;
  }

  Object.entries(entry.headers || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      res.setHeader(key, value);
    }
  });
  res.status(entry.status).send(entry.body);
};

export const cacheAndDedupe = (req, res, next) => {
  if (!shouldCache(req)) return next();

  const cacheKey = buildCacheKey(req);
  const now = Date.now();
  const anonymizedClient = hashToken(req.ip || "unknown")?.slice(0, 8) || "anon";

  const cached = responseCache.get(cacheKey);
  if (cached) {
    if (cached.expiresAt > now) {
      console.info(
        `[cache] ${req.method} ${req.originalUrl} served from cache for client ${anonymizedClient}`
      );
      applyCachedResponse(req, res, cached);
      return;
    }
    responseCache.delete(cacheKey);
  }

  const inProgress = inFlight.get(cacheKey);
  if (inProgress) {
    console.info(
      `[dedupe] Reusing in-flight response for ${req.method} ${req.originalUrl} from client ${anonymizedClient}`
    );
    inProgress
      .then((entry) => applyCachedResponse(req, res, entry))
      .catch(next);
    return;
  }

  let resolveFlight;
  let rejectFlight;
  const flightPromise = new Promise((resolve, reject) => {
    resolveFlight = resolve;
    rejectFlight = reject;
  });
  inFlight.set(cacheKey, flightPromise);

  const clearFlight = () => {
    inFlight.delete(cacheKey);
  };

  res.once("finish", clearFlight);
  res.once("close", clearFlight);

  const recordAndSend = (body, sender) => {
    try {
      const status = res.statusCode || 200;
      const payload = normalizePayload(body);
      let etag = res.getHeader("ETag");
      if (!etag) {
        etag = `"${crypto.createHash("sha256").update(payload).digest("hex").slice(0, 32)}"`;
        res.setHeader("ETag", etag);
      }

      res.setHeader("Cache-Control", CACHE_CONTROL_HEADER);

      const entry = {
        status,
        body,
        etag,
        headers: {
          ETag: etag,
          "Cache-Control": CACHE_CONTROL_HEADER,
        },
        expiresAt: Date.now() + CACHE_TTL_MS,
      };

      const contentType = res.getHeader("Content-Type");
      if (contentType) {
        entry.headers["Content-Type"] = contentType;
      }

      resolveFlight(entry);

      const cacheableStatus =
        (status >= 200 && status < 300) || CACHEABLE_ERROR_CODES.includes(status);
      if (cacheableStatus) {
        const isUpdate = responseCache.has(cacheKey);
        if (!isUpdate && responseCache.size >= MAX_CACHE_ENTRIES) {
          const oldestKey = responseCache.keys().next().value;
          if (oldestKey) {
            responseCache.delete(oldestKey);
          }
        }
        if (isUpdate) {
          responseCache.delete(cacheKey);
        }
        responseCache.set(cacheKey, entry);
        const timer = setTimeout(() => {
          if (responseCache.get(cacheKey) === entry) {
            responseCache.delete(cacheKey);
          }
        }, CACHE_TTL_MS + CLEANUP_BUFFER_MS);
        if (typeof timer.unref === "function") {
          timer.unref();
        }
      }

      return sender(body);
    } catch (err) {
      rejectFlight(err);
      return sender(body);
    }
  };

  const originalSend = res.send.bind(res);
  res.send = (body) => recordAndSend(body, originalSend);

  const originalJson = res.json.bind(res);
  res.json = (body) => recordAndSend(body, originalJson);

  next();
};

export const CACHE_CONTROL_VALUE = CACHE_CONTROL_HEADER;
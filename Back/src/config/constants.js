const normalizeBaseUrl = (value) => {
  if (!value) return null;
  return value.replace(/\/+$/, "");
};

const requireEnv = (value, name) => {
  if (value === undefined || value === null) {
    throw new Error(`${name} is required`);
  }

  const normalized =
    typeof value === "string" ? value.trim() : String(value).trim();

  if (!normalized) {
    throw new Error(`${name} is required`);
  }
  return normalized;
};

export const isValidPort = (value) =>
  Number.isInteger(value) && value > 0 && value <= 65535;

const parsedPort = Number(requireEnv(process.env.PORT, "PORT"));
if (!isValidPort(parsedPort)) {
  throw new Error("PORT must be a valid integer between 1 and 65535");
}
export const PORT = parsedPort;

export const JWT_SECRET = requireEnv(process.env.JWT_SECRET, "JWT_SECRET");
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const SMTP_HOST = process.env.SMTP_HOST || "";
const smtpPortValue = process.env.SMTP_PORT
  ? Number(process.env.SMTP_PORT)
  : 587;
if (!isValidPort(smtpPortValue)) {
  throw new Error("SMTP_PORT must be a valid integer between 1 and 65535");
}
export const SMTP_PORT = smtpPortValue;
export const SMTP_SECURE = process.env.SMTP_SECURE === "true"; // false for 587
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const MAIL_FROM = process.env.MAIL_FROM || "";

// Base URL of your backend (used to build verification link)
export const APP_BASE_URL = normalizeBaseUrl(
  requireEnv(process.env.APP_BASE_URL, "APP_BASE_URL")
);

// Optional: frontend redirect after verify (if you want to redirect)
const FRONTEND_BASE_URL_INPUT = process.env.FRONTEND_BASE_URL;
export const FRONTEND_BASE_URL = normalizeBaseUrl(FRONTEND_BASE_URL_INPUT);

const FRONTEND_BASE_URLS = (process.env.FRONTEND_BASE_URLS || "")
  .split(",")
  .map((value) => normalizeBaseUrl(value.trim()))
  .filter(Boolean);

export const ALLOWED_FRONTEND_ORIGINS = Array.from(
  new Set([FRONTEND_BASE_URL, ...FRONTEND_BASE_URLS].filter(Boolean))
);

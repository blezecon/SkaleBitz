export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const SMTP_HOST = process.env.SMTP_HOST || "";
export const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
export const SMTP_SECURE = process.env.SMTP_SECURE === "true"; // false for 587
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const MAIL_FROM = process.env.MAIL_FROM || "";

// Base URL of your backend (used to build verification link)
export const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:4000";

// Optional: frontend redirect after verify (if you want to redirect)
export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "";
import axios from "axios";

const normalizeBaseUrl = (value) => {
  if (!value) return null;
  return value.replace(/\/+$/, "");
};

const buildLocalFallback = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const { protocol, hostname } = window.location;
  const fallbackPort = import.meta.env.VITE_API_FALLBACK_PORT || "4000";
  return `${protocol}//${hostname}:${fallbackPort}`;
};

const resolvedBaseURL =
  normalizeBaseUrl(import.meta.env.VITE_API_URL) ||
  normalizeBaseUrl(buildLocalFallback());

const api = axios.create({
  baseURL: resolvedBaseURL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token || null;
};

export const clearAuthToken = () => {
  authToken = null;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;

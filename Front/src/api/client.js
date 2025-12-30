import axios from "axios";

const buildLocalFallback = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const { protocol, hostname, port } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const fallbackPort =
      import.meta.env.VITE_API_FALLBACK_PORT || port || "4000";
    const resolvedPort = fallbackPort || "4000";
    return `${protocol}//${hostname}:${resolvedPort}`;
  }

  return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
};

const resolveBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_URL;
  if (envBase) {
    return envBase.replace(/\/+$/, "");
  }

  const fallback = buildLocalFallback();
  return fallback ? fallback.replace(/\/+$/, "") : null;
};

const resolvedBaseURL = resolveBaseUrl();

if (!resolvedBaseURL) {
  throw new Error(
    "API base URL missing: set VITE_API_URL (e.g., http://localhost:4000) or set VITE_API_FALLBACK_PORT to build a http://localhost:<port> fallback."
  );
}

const api = axios.create({
  baseURL: resolvedBaseURL,
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

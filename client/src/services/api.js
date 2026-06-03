import axios from "axios";

/** Express API on Vercel (see server/vercel.json). */
const PRODUCTION_API = "https://pg-backend-lyart.vercel.app/api";

/** Ensure base URL always includes the /api prefix used by server routes. */
export function normalizeApiBase(url) {
  const trimmed = url?.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith("/")) {
    return trimmed.replace(/\/+$/, "") || "/api";
  }

  const withoutTrailing = trimmed.replace(/\/+$/, "");
  if (withoutTrailing.endsWith("/api")) {
    return withoutTrailing;
  }
  return `${withoutTrailing}/api`;
}

/** Backend API base URL — works locally and on Vercel. */
export function getApiBaseUrl() {
  const fromEnv = process.env.REACT_APP_API_URL?.trim();
  if (fromEnv) {
    return normalizeApiBase(fromEnv);
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    // React app on Vercel (e.g. pg-client-lawa): proxy /api → backend in vercel.json
    if (host.endsWith(".vercel.app")) {
      return "/api";
    }
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_API;
  }

  return "http://localhost:5000/api";
}

const API = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: false,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;

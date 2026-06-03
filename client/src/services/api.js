import axios from "axios";

/** Backend API base URL — works locally and on Render/Vercel. */
export function getApiBaseUrl() {
  const fromEnv = process.env.REACT_APP_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    // Vercel: same-origin proxy in vercel.json
    if (host.endsWith(".vercel.app")) {
      return "/api";
    }
    // Render static site or separate API service
    if (host.endsWith(".onrender.com")) {
      return "https://pg-server.onrender.com/api";
    }
  }

  if (process.env.NODE_ENV === "production") {
    return "https://pg-server.onrender.com/api";
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

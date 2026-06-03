const express = require("express");
const cors = require("cors");
const { connectDB, getDbStatus } = require("./db");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^https:\/\/[\w.-]+\.vercel\.app$/i.test(origin)) return true;
  if (/^https:\/\/[\w.-]+\.onrender\.com$/i.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.get("/api/health", async (req, res) => {
  const hasUri = Boolean(process.env.MONGO_URI?.trim());

  if (!hasUri) {
    return res.json({
      ok: false,
      db: "disconnected",
      mongoUriConfigured: false,
      message:
        "MONGO_URI is missing. Add it in Vercel → Project (pg-backend) → Settings → Environment Variables, then redeploy.",
    });
  }

  try {
    await connectDB();
    const dbStatus = getDbStatus();
    res.json({
      ok: dbStatus === "connected",
      db: dbStatus,
      mongoUriConfigured: true,
      message: dbStatus === "connected" ? "API is ready" : "Still connecting to MongoDB",
    });
  } catch (err) {
    res.json({
      ok: false,
      db: "disconnected",
      mongoUriConfigured: true,
      message:
        "Cannot reach MongoDB. Check MONGO_URI value, Atlas user/password, and Network Access (allow 0.0.0.0/0).",
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
  }
});

if (!process.env.MONGO_URI?.trim()) {
  console.error("FATAL: MONGO_URI is not set. Auth and data routes will fail.");
} else {
  connectDB().catch((err) =>
    console.error("MongoDB connection error:", err.message),
  );
}

app.use(async (req, res, next) => {
  if (!req.path.startsWith("/api") || req.path === "/api/health") {
    return next();
  }
  if (!process.env.MONGO_URI?.trim()) {
    return res.status(503).json({
      message:
        "MONGO_URI is not set on the server. Add it in Vercel environment variables and redeploy.",
    });
  }
  try {
    await connectDB();
    next();
  } catch {
    res.status(503).json({
      message:
        "Database unavailable. Verify MONGO_URI and MongoDB Atlas Network Access (0.0.0.0/0).",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

const { verifyUser } = require("./middleware/authMiddleware");

app.get("/protected", verifyUser, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

const clientBuild = path.join(__dirname, "..", "client", "build");
const hasClientBuild = fs.existsSync(path.join(clientBuild, "index.html"));

if (process.env.NODE_ENV === "production" && hasClientBuild) {
  app.use(express.static(clientBuild));
  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientBuild, "index.html"), (err) => {
      if (err) next();
    });
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is running");
  });
}

module.exports = app;

// Local / Render: start HTTP server. Vercel uses the exported app only.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

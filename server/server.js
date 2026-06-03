const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";
  res.json({
    ok: dbState === 1,
    db: dbStatus,
    message:
      dbState === 1
        ? "API is ready"
        : "Database not connected — set MONGO_URI on Render",
  });
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

if (!process.env.MONGO_URI) {
  console.error("FATAL: MONGO_URI is not set. Auth and data routes will fail.");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

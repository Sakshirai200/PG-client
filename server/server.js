const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://pg-client-lawa.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

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

// 🔌 MongoDB Connection
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI environment variable is not defined!");
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));
}

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
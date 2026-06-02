const express = require("express");
const router = express.Router();

const {
    createBooking,
    getUserBookings,
    cancelBooking
} = require("../controllers/bookingController");

const { verifyUser } = require("../middleware/authMiddleware");

// USER ROUTES
router.post("/create", verifyUser, createBooking);
router.get("/my", verifyUser, getUserBookings);
router.delete("/cancel/:id", verifyUser, cancelBooking);

module.exports = router;
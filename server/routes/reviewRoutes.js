const express = require("express");
const router = express.Router();

const {
  addReview,
  getReviews,
  getAverageRating
} = require("../controllers/reviewController");

const { verifyUser } = require("../middleware/authMiddleware");

// USER
router.post("/add", verifyUser, addReview);

// IMPORTANT: keep average route BEFORE /:hostelId
router.get("/average/:hostelId", getAverageRating);

// PUBLIC
router.get("/:hostelId", getReviews);

module.exports = router;
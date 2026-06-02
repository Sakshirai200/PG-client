const express = require("express");
const router = express.Router();

const {
  addHostel,
  getHostels,
  getHostelById,
  getMyHostels,
  updateHostel,
  deleteHostel,
} = require("../controllers/hostelController");

const { verifyUser, isOwner } = require("../middleware/authMiddleware");

// PUBLIC
router.get("/", getHostels);

// OWNER ROUTES
router.post("/add", verifyUser, isOwner, addHostel);
router.get("/my", verifyUser, isOwner, getMyHostels);
router.put("/update/:id", verifyUser, isOwner, updateHostel);
router.delete("/delete/:id", verifyUser, isOwner, deleteHostel);

router.get("/:id", getHostelById);

module.exports = router;
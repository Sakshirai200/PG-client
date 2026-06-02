const express = require("express");
const router = express.Router();

const {
    getAllHostels,
    approveHostel,
    getAllUsers
} = require("../controllers/adminController");

const {
    verifyUser,
    isAdmin
} = require("../middleware/authMiddleware");

// ➤ ADMIN ONLY ROUTES
router.get("/hostels", verifyUser, isAdmin, getAllHostels);
router.put("/approve/:id", verifyUser, isAdmin, approveHostel);
router.get("/users", verifyUser, isAdmin, getAllUsers);

module.exports = router;
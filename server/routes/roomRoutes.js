const express = require("express");
const router = express.Router();

const {
    addRoom,
    getRoomsByHostel,
    getRoomById,
    updateRoom,
    deleteRoom
} = require("../controllers/roomController");

const {
    verifyUser,
    isOwner
} = require("../middleware/authMiddleware");

// ➤ PUBLIC
router.get("/hostel/:hostelId", getRoomsByHostel);

// ➤ OWNER ONLY
router.post("/add", verifyUser, isOwner, addRoom);
router.get("/:id", getRoomById);
router.put("/update/:id", verifyUser, isOwner, updateRoom);
router.delete("/delete/:id", verifyUser, isOwner, deleteRoom);

module.exports = router;
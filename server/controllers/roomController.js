const Room = require("../models/Room");
const Hostel = require("../models/Hostel");

// ➤ ADD ROOM (Owner Only)
exports.addRoom = async (req, res) => {
  try {
    const { hostelId, type, price, vacancy } = req.body;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (hostel.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your hostel" });
    }

    const room = await Room.create({
      hostelId,
      type,
      price,
      vacancy,
      availability: Number(vacancy) > 0,
    });

    res.status(201).json({ message: "Room added", room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➤ GET ROOMS BY HOSTEL (Public)
exports.getRoomsByHostel = async (req, res) => {
  try {
    const rooms = await Room.find({ hostelId: req.params.hostelId });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};

// ➤ UPDATE ROOM
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const hostel = await Hostel.findById(room.hostelId);

    // ✅ Ownership check
    if (hostel.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your hostel" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "Room updated", updatedRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➤ GET SINGLE ROOM BY ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch room details",
      error: error.message,
    });
  }
};

// ➤ DELETE ROOM
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const hostel = await Hostel.findById(room.hostelId);

    // ✅ Ownership check
    if (hostel.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your hostel" });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Hostel = require("../models/Hostel");
const User = require("../models/User");

// ➤ GET ALL HOSTELS (including unapproved)
exports.getAllHostels = async (req, res) => {
    try {
        const hostels = await Hostel.find().populate("ownerId", "name email");
        res.json(hostels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ➤ APPROVE HOSTEL
exports.approveHostel = async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id);

        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        hostel.approved = true;
        await hostel.save();

        res.json({ message: "Hostel approved successfully", hostel });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ➤ GET ALL USERS
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // hide password
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
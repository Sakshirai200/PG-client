const Booking = require("../models/Booking");
const Room = require("../models/Room");

// ➤ CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { roomId, fullName, mobile, checkInDate, persons } = req.body;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.vacancy <= 0) {
      return res.status(400).json({ message: "Room not available" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      hostelId: room.hostelId,
      roomId,
      fullName,
      mobile,
      checkInDate,
      persons,
      status: "booked",
    });

    room.vacancy = room.vacancy - Number(persons || 1);

    if (room.vacancy <= 0) {
      room.availability = false;
    }

    await room.save();

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➤ GET USER BOOKINGS
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate("hostelId")
            .populate("roomId");

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ➤ CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    const room = await Room.findById(booking.roomId);

    if (room) {
      room.vacancy = room.vacancy + Number(booking.persons || 1);
      room.availability = true;
      await room.save();
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
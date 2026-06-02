const Hostel = require("../models/Hostel");

// ➤ ADD HOSTEL
exports.addHostel = async (req, res) => {
    try {
        const hostel = await Hostel.create({
            ...req.body,
            ownerId: req.user.id
        });

        res.status(201).json({ message: "Hostel added", hostel });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ➤ GET ALL APPROVED HOSTELS
exports.getHostels = async (req, res) => {
    try {
        const { city, minPrice, maxPrice, facility } = req.query;

        let filter = {};

        // ➤ City filter
        if (city) {
            filter.city = { $regex: city, $options: "i" };
        }

        // ➤ Facility filter
        if (facility) {
            filter.facilities = { $in: [facility] };
        }

        let hostels = await Hostel.find(filter);

        // ➤ Price filter (manual since priceRange is string)
        if (minPrice || maxPrice) {
            hostels = hostels.filter((h) => {
                const prices = h.priceRange.split("-");
                const min = parseInt(prices[0]);
                const max = parseInt(prices[1]);

                return (
                    (!minPrice || max >= minPrice) &&
                    (!maxPrice || min <= maxPrice)
                );
            });
        }

        res.json(hostels);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    res.status(200).json(hostel);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hostel details",
      error: error.message,
    });
  }
};


// ➤ GET OWNER HOSTELS
exports.getMyHostels = async (req, res) => {
    try {
    const hostels = await Hostel.find({ ownerId: req.user.id });
    res.status(200).json(hostels);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch owner hostels",
      error: error.message,
    });
  }
};

// ➤ UPDATE HOSTEL (WITH OWNERSHIP CHECK)
exports.updateHostel = async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id);

        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        // ✅ Ownership check
        if (hostel.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not your hostel" });
        }

        const updatedHostel = await Hostel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({ message: "Hostel updated", updatedHostel });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ➤ DELETE HOSTEL (WITH OWNERSHIP CHECK)
exports.deleteHostel = async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id);

        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        // ✅ Ownership check
        if (hostel.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not your hostel" });
        }

        await Hostel.findByIdAndDelete(req.params.id);

        res.json({ message: "Hostel deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const Review = require("../models/Review");
const mongoose = require("mongoose");

// ➤ ADD REVIEW
exports.addReview = async (req, res) => {
    try {
        const { hostelId, rating, comment } = req.body;

        // Optional: prevent duplicate review
        const existing = await Review.findOne({
            userId: req.user.id,
            hostelId
        });

        if (existing) {
            return res.status(400).json({ message: "You already reviewed this hostel" });
        }

        const review = await Review.create({
            userId: req.user.id,
            hostelId,
            rating,
            comment
        });

        res.status(201).json({ message: "Review added", review });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ➤ GET REVIEWS FOR A HOSTEL
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ hostelId: req.params.hostelId })
            .populate("userId", "name");

        res.json(reviews);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ➤ GET AVERAGE RATING FOR A HOSTEL
exports.getAverageRating = async (req, res) => {
    try {
        const hostelId = req.params.hostelId;

        const result = await Review.aggregate([
            {
                $match: {
                    hostelId: new mongoose.Types.ObjectId(hostelId)
                }
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        // If no reviews exist
        if (result.length === 0) {
            return res.json({
                avgRating: 0,
                totalReviews: 0
            });
        }

        res.json({
            avgRating: result[0].avgRating.toFixed(1), // 4.5 format
            totalReviews: result[0].totalReviews
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: String,
    location: String,
    address: String,
    city: String,
    facilities: [String],
    priceRange: String,
    images: [String],
    geoLocation: {
        lat: Number,
        lng: Number
    },
    approved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Hostel", hostelSchema);
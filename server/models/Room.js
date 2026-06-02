const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    vacancy: {
      type: Number,
      required: true,
    },

    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
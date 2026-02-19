const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  caloriesBurned: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Exercise", exerciseSchema);

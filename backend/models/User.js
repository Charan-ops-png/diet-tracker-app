const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // NEW FITNESS FIELDS
  calorieGoal: {
    type: Number,
    default: 2000,
  },
  currentWeight: {
    type: Number,
    default: 70,
  },
  targetWeight: {
    type: Number,
    default: 65,
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  foods: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalCalories: {
    type: Number,
    default: 0,
  },
  totalProtein: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("DailyLog", dailyLogSchema);

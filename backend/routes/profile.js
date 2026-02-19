const express = require("express");
const router = express.Router();
const User = require("../models/User");


// GET USER PROFILE
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("PROFILE GET ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// UPDATE USER PROFILE
router.put("/:userId", async (req, res) => {
  try {
    const { calorieGoal, currentWeight, targetWeight } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { calorieGoal, currentWeight, targetWeight },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

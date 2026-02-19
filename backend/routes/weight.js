const express = require("express");
const router = express.Router();
const WeightLog = require("../models/WeightLog");


// ADD / UPDATE TODAY'S WEIGHT
router.post("/add", async (req, res) => {
  try {
    const { userId, date, weight } = req.body;

    let log = await WeightLog.findOne({ user: userId, date });

    if (log) {
      log.weight = weight;
    } else {
      log = new WeightLog({ user: userId, date, weight });
    }

    await log.save();
    res.json(log);

  } catch (err) {
    console.error("WEIGHT ADD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// GET LAST 7 DAYS WEIGHT
router.get("/weekly/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const dates = [];
    const weights = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      dates.push(dateStr);

      const log = await WeightLog.findOne({ user: userId, date: dateStr });
      weights.push(log ? log.weight : null);
    }

    res.json({ dates, weights });

  } catch (err) {
    console.error("WEIGHT WEEKLY ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

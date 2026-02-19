const express = require("express");
const router = express.Router();

const DailyLog = require("../models/DailyLog");
const Exercise = require("../models/Exercise");

router.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({ ok: true });
});

// GET LAST 7 DAYS STATS (SAFE)
router.get("/weekly/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const dates = [];
    const eaten = [];
    const burned = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      dates.push(dateStr);

      // SAFE queries
      const log = await DailyLog.findOne({ user: userId, date: dateStr }).catch(() => null);
      const exercises = await Exercise.find({ user: userId, date: dateStr }).catch(() => []);

      eaten.push(log?.totalCalories || 0);

      const burnedCalories = exercises.reduce(
        (sum, ex) => sum + (ex.caloriesBurned || 0),
        0
      );

      burned.push(burnedCalories);
    }

    return res.json({ dates, eaten, burned });

  } catch (err) {
    console.error("WEEKLY ROUTE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET TODAY'S DASHBOARD
router.get("/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;

    // get food log
    const log = await DailyLog.findOne({ user: userId, date })
      .populate("foods.food");

    // get exercises
    const exercises = await Exercise.find({ user: userId, date });

    // totals
    const totalCalories = log ? log.totalCalories : 0;
    const totalProtein = log ? log.totalProtein : 0;

    const caloriesBurned = exercises.reduce(
      (sum, ex) => sum + ex.caloriesBurned,
      0
    );

    // assume daily goal = 2000 calories (we will make this dynamic later)
    const User = require("../models/User");

    const user = await User.findById(userId);

    const calorieGoal = user?.calorieGoal || 2000;

    const remainingCalories = calorieGoal - totalCalories + caloriesBurned;

    res.json({
      totalCalories,
      totalProtein,
      caloriesBurned,
      remainingCalories,
      foods: log ? log.foods : [],
      exercises,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

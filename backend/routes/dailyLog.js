const express = require("express");
const DailyLog = require("../models/DailyLog");
const Food = require("../models/Food");

const router = express.Router();


// ADD FOOD TO TODAY'S LOG
router.post("/add", async (req, res) => {
  try {
    const { userId, foodId, quantity, date } = req.body;

    // find food details
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }

    // find or create daily log
    let log = await DailyLog.findOne({ user: userId, date });

    if (!log) {
      log = new DailyLog({
        user: userId,
        date,
        foods: [],
        totalCalories: 0,
        totalProtein: 0,
      });
    }

    // add food entry
    log.foods.push({
      food: foodId,
      quantity,
    });

    // update totals
    log.totalCalories += food.calories * quantity;
    log.totalProtein += food.protein * quantity;

    await log.save();

    res.json({ msg: "Food added to daily log", log });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// GET DAILY LOG BY DATE
router.get("/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;

    const log = await DailyLog.findOne({ user: userId, date })
      .populate("foods.food");

    if (!log) {
      return res.json({ msg: "No log for this date" });
    }

    res.json(log);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

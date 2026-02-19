const express = require("express");
const Exercise = require("../models/Exercise");

const router = express.Router();


// ADD EXERCISE
router.post("/add", async (req, res) => {
  try {
    const { userId, date, activity, caloriesBurned } = req.body;

    const newExercise = new Exercise({
      user: userId,
      date,
      activity,
      caloriesBurned,
    });

    await newExercise.save();

    res.json({ msg: "Exercise logged successfully", exercise: newExercise });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// GET EXERCISES BY DATE
router.get("/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;

    const exercises = await Exercise.find({ user: userId, date });

    res.json(exercises);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

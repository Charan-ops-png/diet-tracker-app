const express = require("express");
const Food = require("../models/Food");

const router = express.Router();


// ADD FOOD
router.post("/add", async (req, res) => {
  try {
    const { name, calories, protein } = req.body;

    const newFood = new Food({
      name,
      calories,
      protein,
    });

    await newFood.save();

    res.json({ msg: "Food added successfully", food: newFood });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// GET ALL FOODS
router.get("/all", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

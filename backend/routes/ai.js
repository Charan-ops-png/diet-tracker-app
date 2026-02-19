const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const User = require("../models/User");
const DailyLog = require("../models/DailyLog");
const Exercise = require("../models/Exercise");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/coach/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const user = await User.findById(userId);
    const log = await DailyLog.findOne({ user: userId, date: today });
    const exercises = await Exercise.find({ user: userId, date: today });

    const eaten = log ? log.totalCalories : 0;
    const burned = exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);

    const prompt = `
You are a professional fitness coach.

User details:
- Calorie goal: ${user.calorieGoal}
- Current weight: ${user.currentWeight} kg
- Target weight: ${user.targetWeight} kg
- Calories eaten today: ${eaten}
- Calories burned today: ${burned}

Give:
1) Diet advice for today
2) Workout advice
3) Weight progress suggestion
4) Short motivational line

Keep it concise and structured.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful fitness AI coach." },
        { role: "user", content: prompt }
      ],
      max_tokens: 400
    });

    res.json({ advice: completion.choices[0].message.content });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ msg: "AI error" });
  }
});

module.exports = router;

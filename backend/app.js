const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/food", require("./routes/food"));
app.use("/api/log", require("./routes/dailyLog"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/exercise", require("./routes/exercise"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/weight", require("./routes/weight"));

// Test route
app.get("/", (req, res) => {
  res.send("Diet Tracker API is running...");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.log(err));

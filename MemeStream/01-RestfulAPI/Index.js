const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Schema
const MemeSchema = new mongoose.Schema({
  userId: String,
  title: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Meme = mongoose.model("Meme", MemeSchema);

// Routes
app.post("/memes", async (req, res) => {
  try {
    const meme = new Meme(req.body);
    await meme.save();
    res.status(201).json(meme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/memes", async (req, res) => {
  try {
    const { userId } = req.query;
    const memes = userId ? await Meme.find({ userId }) : await Meme.find();
    res.json(memes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// server.js
const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const dotenv     = require("dotenv");
const path       = require("path");

dotenv.config();

const tournamentRoutes = require("./routes/tournaments");
const commentRoutes    = require("./routes/comments");
const likeRoutes       = require("./routes/likes");

const app = express();

// ─── Middleware ───────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── API routes ───────────────────────────────────────
app.use("/api/tournaments", tournamentRoutes);  //  <-- public GET, owner‑protected POST/PUT/DELETE
app.use("/api/comments",   commentRoutes);      //  GET public, POST protected (inside file)
app.use("/api/likes",      likeRoutes);         //  ditto

// (Optional) If you still want a raw DELETE shortcut:
app.delete("/api/tournaments/:id", async (req, res) => {
  const Tournament = require("./models/Tournament");
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ message: "Tournament deleted" });
  } catch (err) {
    console.error("Error deleting tournament:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── MongoDB connection ───────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ─── Start server ─────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

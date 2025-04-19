// routes/tournaments.js
const express      = require("express");
const router       = express.Router();
const Tournament   = require("../models/Tournament");
const verifyToken  = require("../middleware/auth");

// ---------- GET all tournaments (public) ----------
router.get("/", async (_, res) => {
  try {
    // include createdBy so the frontend can tell who owns each event
    const tournaments = await Tournament.find()
      .sort({ date: 1 }) // optional: chronological
      .select(
        "title date startTime endTime image note platforms links createdBy createdAt likeCount"
      );
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- GET my tournaments (still handy for dashboards) ----------
router.get("/my", verifyToken, async (req, res) => {
  try {
    const mine = await Tournament.find({ createdBy: req.user.uid }).select(
      "title date startTime endTime image note platforms links createdBy createdAt likeCount"
    );
    res.json(mine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- CREATE ----------
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      title,
      date,
      startTime,
      endTime,
      image,
      note,
      platforms,
      links,
    } = req.body;

    const t = new Tournament({
      title,
      date,
      startTime,
      endTime,
      image,
      note,
      platforms,
      links,
      createdBy: req.user.uid,
    });

    await t.save();
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- UPDATE (owner only) ----------
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Tournament not found" });
    if (t.createdBy !== req.user.uid)
      return res.status(403).json({ message: "Forbidden" });

    const allowed = [
      "title",
      "date",
      "startTime",
      "endTime",
      "image",
      "note",
      "platforms",
      "links",
    ];
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) t[k] = req.body[k];
    });

    const updated = await t.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- DELETE (owner only) ----------
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Tournament not found" });
    if (t.createdBy !== req.user.uid)
      return res.status(403).json({ message: "Forbidden" });

    await t.deleteOne();
    res.json({ message: "Tournament deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

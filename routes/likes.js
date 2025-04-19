// routes/likes.js
const express = require('express');
const Like = require('../models/Like');
const Tournament = require('../models/Tournament');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// GET: count total likes + check if current user liked
router.get('/', verifyToken, async (req, res) => {
  const { tournamentId } = req.query;

  try {
    const count = await Like.countDocuments({ tournamentId });
    const userLiked = await Like.exists({ tournamentId, userId: req.user.uid });

    res.json({ count, liked: !!userLiked });
  } catch (err) {
    console.error('GET /likes error:', err);
    res.status(500).json({ message: 'Server error fetching likes' });
  }
});

// POST: toggle like
router.post('/', verifyToken, async (req, res) => {
  const { tournamentId } = req.body;
  const userId = req.user.uid;

  try {
    const existingLike = await Like.findOne({ tournamentId, userId });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
    } else {
      // Like
      await Like.create({ tournamentId, userId });
    }

    // Recalculate total likes
    const count = await Like.countDocuments({ tournamentId });

    // Update likeCount in Tournament model
    await Tournament.findByIdAndUpdate(tournamentId, { likeCount: count });

    res.json({ count, liked: !existingLike });

  } catch (err) {
    console.error('POST /likes error:', err);
    res.status(500).json({ message: 'Server error toggling like' });
  }
});

module.exports = router;

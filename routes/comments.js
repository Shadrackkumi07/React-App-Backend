// routes/comments.js
const express = require('express');
const Comment = require('../models/Comment');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// GET comments for a tournament
router.get('/', async (req, res) => {
  const { tournamentId } = req.query;
  try {
    const comments = await Comment.find({ tournamentId }).sort('createdAt');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new comment (protected)
router.post('/', verifyToken, async (req, res) => {
  const { tournamentId, content } = req.body;
  try {
    const comment = new Comment({
      tournamentId,
      userId: req.user.uid,
      content,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

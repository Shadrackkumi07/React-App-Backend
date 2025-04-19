// models/Like.js
const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  userId: {
    type: String,   // Firebase UID
    required: true,
  },
}, {
  timestamps: true,
});

// create unique compound index
LikeSchema.index(
  { tournamentId: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model('Like', LikeSchema);

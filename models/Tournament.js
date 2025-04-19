// models/Tournament.js
const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  date:      { type: String, required: true },
  startTime: { type: String, required: true },
  endTime:   { type: String },
  image:     { type: String },
  note:      { type: String },
  platforms: [{ type: String }],
  links:     [{ name: String, url: String }],
  createdBy: { type: String, required: true },  // Firebase UID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tournament", TournamentSchema);
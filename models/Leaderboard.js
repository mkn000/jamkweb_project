const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
});

//the combination of name and score must be unique
LeaderboardSchema.index({ name: 1, score: 1 }, { unique: true });
const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
module.exports = Leaderboard;

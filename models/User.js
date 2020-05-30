const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, required: false, default: 0 },
  gamesplayed: { type: Number, required: false, default: 0 },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

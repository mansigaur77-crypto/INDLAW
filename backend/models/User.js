const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  state: String,
  gender: String,
  profile: String
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
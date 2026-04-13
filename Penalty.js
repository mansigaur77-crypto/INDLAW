const mongoose = require("mongoose");

const penaltySchema = new mongoose.Schema({
  violation: String,
  state: String,
  fine_amount: Number
});

module.exports = mongoose.models.Penalty || mongoose.model("Penalty", penaltySchema);
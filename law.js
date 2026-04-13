const mongoose = require("mongoose");

const lawSchema = new mongoose.Schema({
  law_name: String,
  section_number: String,
  description: String
});

module.exports = mongoose.models.Law || mongoose.model("Law", lawSchema);
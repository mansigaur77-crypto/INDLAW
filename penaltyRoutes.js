const express = require("express");
const router = express.Router();
const { getPenalty } = require("../controllers/penaltyController");
const Penalty = require("../models/Penalty");

// Get penalty
router.get("/get", getPenalty);

// Add penalty (for data entry)
router.post("/add", async (req, res) => {
  const penalty = new Penalty(req.body);
  await penalty.save();
  res.json({ message: "Penalty added" });
});

module.exports = router;
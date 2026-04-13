const express = require("express");
const router = express.Router();

const { searchLaw } = require("../controllers/lawController");
const Law = require("../models/law.js"); // 👈 ADD THIS

// 🔍 Search law
router.get("/search", searchLaw);

// ➕ Add new law (PASTE HERE)
router.post("/add", async (req, res) => {
    try {
      const law = await Law.create(req.body);
      res.json(law);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


module.exports = router;
 
const Penalty = require("../models/Penalty");

exports.getPenalty = async (req, res) => {
  const { violation, state } = req.query;

  const result = await Penalty.findOne({
    violation: { $regex: violation, $options: "i" },
    state: { $regex: state, $options: "i" }
  });

  if (!result) {
    return res.json({ message: "No penalty found" });
  }

  res.json(result);
};
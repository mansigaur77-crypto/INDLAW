const Law = require("../models/law.js");

exports.searchLaw = async (req, res) => {
  const query = req.query.query;

  console.log("Search Query:", query); // debug

  const laws = await Law.find({
    $or: [
      { law_name: { $regex: query, $options: "i" } },
      { section_number: { $regex: query, $options: "i" } }
    ]
  });

  console.log("Found Laws:", laws); // debug

  res.json(laws);
};
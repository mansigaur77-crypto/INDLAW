const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Fix DNS issue (good you added this 👍)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const lawRoutes = require("./routes/lawRoutes");
app.use("/api/law", lawRoutes);
const penaltyRoutes = require("./routes/penaltyRoutes");
app.use("/api/penalty", penaltyRoutes);

app.get("/", (req, res) => {
  res.send("INDLAW API Running");
});

console.log("Starting server...");

// 🔥 CONNECT DB FIRST, THEN START SERVER
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log("MongoDB Connected");

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB Connection Error:", err);
});
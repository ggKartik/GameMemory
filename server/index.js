const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index.js");

dotenv.config({ path: "config/config.env" });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/", router);

// Start server
app.listen(process.env.PORT || 3601, (err) => {
  if (err) {
    console.error("Server error:", err);
    return;
  }
  console.log(`Server running on port ${process.env.PORT || 3601}`);
});

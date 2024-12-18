const express = require("express");
const inquiryRoutes = require("./routes/inquiry.js");
const menuRoutes = require("./routes/menu.js");
const blogRoutes = require("./routes/blog.js");
const Mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware-----------------*
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB --------------------------*

const mongoURI = "mongodb://localhost:27017/your_database_name";

Mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// routes-----------------*
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/blogs", blogRoutes);
// --------------------------*

// test
app.get("/api", (req, res) => {
  res.send("Hello world");
});
// --------------------------*

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

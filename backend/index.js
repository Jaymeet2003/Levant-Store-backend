const express = require("express");
const inquiryRoutes = require("./routes/inquiry.js");
const menuRoutes = require("./routes/menu.js");
const blogRoutes = require("./routes/blog.js");
const Mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
require("dotenv").config({
  path: path.resolve(__dirname, '.env'),
});

const app = express();

// middleware-----------------*
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// const allowedOrigins = [
//   'https://admin.yourapp.com', // Admin frontend URL
//   'https://client.yourapp.com', // Client frontend URL
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));


// Connect to MongoDB --------------------------*

Mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

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

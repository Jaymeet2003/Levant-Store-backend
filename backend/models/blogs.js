const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Blog Schema
const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  seoKeywords: { type: [String], required: false },
  image: { type: String, required: false }, // Optional field for image paths
  datePosted: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", blogSchema);

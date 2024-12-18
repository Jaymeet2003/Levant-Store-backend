const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: true,
      minlength: [10, "Content must be at least 10 characters long"],
    },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    seoKeywords: {
      type: String,
      required: true,
      trim: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Blog", blogSchema);

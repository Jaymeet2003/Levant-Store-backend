const Blog = require("../models/blogs");

exports.createBlog = async (req, res) => {
  try {
    const { title, content, metaDescription, seoKeywords, htmlContent } =
      req.body;
    const newBlog = new Blog({
      title,
      content,
      metaDescription,
      seoKeywords,
      htmlContent,
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBlogById = async (req, res) => {
  try {
    const { title, content, metaDescription, seoKeywords, htmlContent } =
      req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, metaDescription, seoKeywords, htmlContent },
      { new: true, runValidators: true }
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

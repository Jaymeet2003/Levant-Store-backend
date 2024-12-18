const { getFilePath, removeFile } = require("../utils/fileUtils");
const fs = require("fs");

exports.uploadMenu = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded or file is not a PDF.",
    });
  }
  res.json({ path: "/uploads/menu.pdf" });
};

exports.getCurrentMenu = (req, res) => {
  const filePath = getFilePath();
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res
      .status(404)
      .send({ error: "Menu not found.! Please upload the menu.!" });
  }
};

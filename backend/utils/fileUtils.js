const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "../public/menu");
const menuFile = "menu.pdf";

function getFilePath() {
  return path.join(uploadsDir, menuFile);
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = {
  getFilePath,
  removeFile,
};

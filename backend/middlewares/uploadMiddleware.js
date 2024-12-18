const multer = require("multer");
const { getFilePath, removeFile } = require("../utils/fileUtils");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = getFilePath();
    removeFile(filePath);
    cb(null, "./public/menu/");
  },
  filename: (req, file, cb) => {
    cb(null, "menu.pdf");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("menu");

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          error: "File size too large. Maximum allowed size is 10MB.",
        });
      }
      return res.status(500).json({ error: "Multer error: " + err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = uploadMiddleware;

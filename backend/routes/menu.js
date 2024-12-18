const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

router.post("/upload", uploadMiddleware, menuController.uploadMenu);
router.get("/", menuController.getCurrentMenu);

module.exports = router;

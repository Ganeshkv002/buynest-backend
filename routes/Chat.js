
const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/chatController");
router.post("/ai-chat", chatWithAI);
module.exports = router;
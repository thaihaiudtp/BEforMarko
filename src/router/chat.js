const express = require("express");
const router = express.Router();
const { sendMessage, getChatHistory } = require("../controller/chatController");
const {verifyToken} = require('../middleware/verifyToken')
router.post("/", verifyToken,sendMessage);
router.get("/get", verifyToken, getChatHistory);
module.exports = router;
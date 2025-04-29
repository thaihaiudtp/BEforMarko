const express = require("express");
const router = express.Router();
const { sendMessage, getChatHistory, sendImage, createWorkflow, getWorkflowsByUser} = require("../controller/chatController");
const {verifyToken} = require('../middleware/verifyToken')
router.get("/get/:workflowId", verifyToken, getChatHistory);
router.post("/image", sendImage);
router.post('/create-workflow', verifyToken, createWorkflow)
router.get('/workflow', verifyToken, getWorkflowsByUser)
router.post("/", verifyToken,sendMessage);
module.exports = router;
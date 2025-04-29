const express = require("express");
const router = express.Router();
const {getCurrentUser, changePassword} = require('../controller/userController')
const {verifyToken} = require('../middleware/verifyToken')
router.get('/get-user', verifyToken, getCurrentUser)
router.put('/change-pass', verifyToken, changePassword)
module.exports = router;
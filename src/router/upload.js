const express = require("express");
const router = express.Router();
const {uploadImage, getImage} = require('../controller/userController')
const {verifyToken} = require('../middleware/verifyToken')
const fileUploader = require('../config/uploadImage')
router.post('/image', verifyToken,fileUploader.single('file'), uploadImage);
router.get('/get-image', verifyToken, getImage);
module.exports = router;
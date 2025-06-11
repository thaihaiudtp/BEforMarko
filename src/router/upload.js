const express = require("express");
const router = express.Router();
const {uploadImage, getImage} = require('../controller/userController')
const {verifyToken} = require('../middleware/verifyToken')
const upload = require('../config/uploadImage')
router.post('/image', verifyToken,upload.single('file'), uploadImage);
router.get('/get-image', verifyToken, getImage);
module.exports = router;
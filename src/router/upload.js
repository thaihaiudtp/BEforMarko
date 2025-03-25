const express = require("express");
const router = express.Router();
const {uploadImage, getImage} = require('../controller/userController')
const {verifyToken} = require('../middleware/verifyToken')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
router.post('/image', verifyToken,upload.single('image'), uploadImage);
router.get('/get-image', verifyToken, getImage);
module.exports = router;
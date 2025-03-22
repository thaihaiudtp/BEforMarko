const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController');
router.post('/register', AuthController.Register);
router.post('/login', AuthController.Login);
router.get('/me', AuthController.authGoogle);
router.post('/logout', AuthController.logout);
module.exports = router;
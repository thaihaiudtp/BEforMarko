const express = require('express');
const router = express.Router();
const passport = require('passport');
const { genAccessToken } = require('../util/genAcessToken');
router.get(
    '/twitter', passport.authenticate('twitter')
);
router.get(
    '/twitter/callback',   passport.authenticate('twitter', { failureRedirect: '/login' }), 
    (req, res) => {
      if (!req.user) {
        return res.status(401).json({ message: "Xác thực thất bại" });
      }
      const token = genAccessToken(req.user.email, req.user.fullname, req.user._id);
      res.redirect(`https://react-image-symphony.app.genez.io/login?token=${token}`);
    }
)

module.exports = router;
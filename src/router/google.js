const express = require('express');
const router = express.Router();
const passport = require('passport');
router.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
);
router.get(
    '/auth/google/callback', passport.authenticate('google', { session: false }), 
    (req, res) => {
      if (!req.user) {
        return res.status(401).json({ message: "Xác thực thất bại" });
      }
      const { user, token } = req.user;
      res.redirect(`https://flowly-ai-chat.app.genez.io/auth?token=${token}`);
    }
)

module.exports = router;
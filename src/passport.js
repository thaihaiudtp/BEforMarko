const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./model/user');
const {genAccessToken} = require('./util/genAcessToken');
require('dotenv').config();
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
  });
  
  passport.use(
    new GoogleStrategy({
        clientID: process.env.Client_ID,
        clientSecret: process.env.Client_Secret,
        callbackURL: 'https://50f8ddd6-2f59-45d5-840d-5ee1daf6afb0.us-east-1.cloud.genez.io/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {  
        if (!profile) {
            console.log("Profile is undefined!");  
            return done(new Error("Google Profile is undefined"));
        }
        try {
          let existingUser = await User.findOne({ email: profile.emails[0].value });
          if (existingUser) {
            console.log("User already exists:", existingUser);
          } else {
            console.log("Creating new Google user...");

            existingUser = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                fullname: profile.displayName,
                password: profile.emails[0].value,
            });
          await existingUser.save();
        }
        const token = genAccessToken(profile.emails[0].value, profile.displayName);
        
        return done(null, { user: existingUser, token });
        } catch (error) {
          console.error("Error in Google OAuth:", error);
          return done(error, null);
        }
    })
);
module.exports = passport;
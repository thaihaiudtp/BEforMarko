const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./model/user');
const {genAccessToken} = require('./util/genAcessToken');
require('dotenv').config();

passport.use(
    new GoogleStrategy({
        clientID: process.env.Client_ID,
        clientSecret: process.env.Client_Secret,
        callbackURL: 'https://api.thaihadtp.id.vn/auth/google/callback'
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
        const token = genAccessToken(profile.emails[0].value, profile.displayName, existingUser._id);
        
        return done(null, { user: existingUser, token });
        } catch (error) {
          console.error("Error in Google OAuth:", error);
          return done(error, null);
        }
    })
);
  passport.serializeUser((obj, done) => {
    const user = obj;
    done(null, user._id);
  });

  
  passport.deserializeUser(async (id, done) => {
    try {
        console.log("Deserializing user with ID:", id);
        const user = await User.findById(id);
        console.log("Found user:", user);
        done(null, user);
    } catch (error) {
        console.error("Error in deserializing user:", error);
        done(error, null);
    }
});

module.exports = passport;
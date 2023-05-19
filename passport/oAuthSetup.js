var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
// var GOOGLE_CLIENT_ID = require('./secret.env');
// var GOOGLE_CLIENT_SECRET = require('./secret.env');

// console.log('google', GOOGLE_CLIENT_ID)

const GOOGLE_CLIENT_ID = "930684183189-rr6quoof36j1qhkjp6k0hfkeu9h7mnnq.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile)
    })
)
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
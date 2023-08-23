var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
require('dotenv').config()
const pool = require('../db.js');
const { v4: uuidv4 } = require('uuid');
var GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  function(accessToken, refreshToken, profile, done) {
    const id = uuidv4()
    pool.query(`SELECT * FROM users WHERE g_profile_id = $1`, [profile.id],
    (err, res) => {
      // cant access value of email object
      console.log('>', profile.emails[0].value);
      if (err) throw err;
      // if profile.id not found create entry into users table
      if (res.rows.length === 0) {
        pool.query(`INSERT INTO users 
        (user_id, email, password, first_name, last_name, g_profile_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, 
        [id, profile.emails[0].value, "", profile.name.givenName, profile.name.familyName, profile.id], (err, result) => {
          if (err) throw err;
          done(null, result.rows[0])
        })
      } else {
       done(null, res.rows[0])

      }
      // req.session.userId = user.id; // Save the user ID in the session
      // res.cookie('user', String(user.user_id))
    })
    // done(null, profile)
    }
));

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
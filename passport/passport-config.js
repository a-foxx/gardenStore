const pool = require('../db.js')
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const passport = require('passport');

module.exports = function (passport) {

  // Configure local strategy to be use for local login
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",  
  },
  async (email, password, done) => {
    pool.query(`SELECT * FROM users WHERE email = $1`, [email], function(err, result) {
      if (err) done(null, false);
      if (!result.rows[0]) return done(null, false);
      if (result.rows[0])
      bcrypt.compare(password, result.rows[0].password, (err, passwordMatch) => {
        if (err) done(null, false);
        if (passwordMatch) {
          return done(null, result.rows[0]);
        } else {
          return done(null, false);
        }
      });
    });
  }));


  passport.serializeUser((user, done) => {
    return done(null, user)
  })

  passport.deserializeUser((id, done) => {
    // console.log(">> ", id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
      if (err) {
        return done(err);
      }
      if (result.rows.length > 0) {
        const user = result.rows[0];
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });

}

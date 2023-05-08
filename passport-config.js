const pool = require('./db.js')
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');

// const user = {
//     usernameField: ;
//     passwordField: 'bcrypt-hashed-password';
// }

function getUserByEmail(email) {
  pool.query(`SELECT * FROM users WHERE email = $1`, [email], function(err, user) {
    if(err) return null;
    console.log('2', user.rows[0]);
    if(!user) return null;

    return user.rows[0]
  })
}

async function initializePassport(passport) {

    const authenticateUser = async (email, password, done) => {

      pool.query(`SELECT * FROM users WHERE email = $1`, [email], function(err, res) {
        
        if(err) return null;
        if(!res.rows[0]) return null;
        const user = res.rows[0];
        console.log(user);
        if (user == null) {
          return done(null, false, {message: 'No user found'})
        } try {
          if (password != user.password) {
            console.log('bad password')
            return done(null, false, {message: 'password is incorrect'})
          } else {
            console.log('3', res)
            return done(null, res)
          }
        } catch(err) {
          console.log(err)
          return done(err)
        }
      })

    }

passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((id, done) => done(null, getUserById(id)))

}

 module.exports = initializePassport

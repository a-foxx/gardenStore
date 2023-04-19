const { authenticate } = require('passport')
const pool = require('./db.js')
const crypto = require('crypto');
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const passport = require('passport');

// const user = {
//     usernameField: ;
//     passwordField: 'bcrypt-hashed-password';
// }

const initializePassport = () => {
    
passport.use(new LocalStrategy(
    function (username, password, done) {
      console.log(username, password)
        pool.query(`SELECT * FROM users WHERE email = $1`, [username], function(err, user) {
        if(err) return done(err);
  
        if(!user) return done(null, false);
  
        if(user.password != password) return done(null, false);
  
        return done(null, user)
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    db.users.findById(id, function (err, user) {
      if (err) return done(err); 
      done(null, user);
    });
  });

}




// const initializePassport = () => {
// passport.use(new LocalStrategy((username, password, done) => {
//       pool.query(`SELECT * FROM users WHERE email = $1`, [username], 
//       function(err, user) {
//           if (err) {
//               return done(err)
//           }
//           if(!user) {
//               return done(null, false)
//           }


//           bcrypt.compare(password, hash, (err, isValid) => {
//               if (err) {
//                   return done(err)
//               }
//               if (!isValid) {
//                   return done(null, false)
//               }
//               return done(null, user)
//           })
//       })
// }
// ))

//           passport.serializeUser(function(user, cb) {
//             process.nextTick(function() {
//               return cb(null, {
//                 id: user.id,
//                 username: user.username,
//                 picture: user.picture
//               });
//             });
//           });
          
//           passport.deserializeUser(function(user, cb) {
//             process.nextTick(function() {
//               return cb(null, user);
//             });
//           });
// }

// function initialize(passport) {
//  const authenticateUser = (email, password, done) => {
//     pool.get(`SELECT * FROM users WHERE email = ?`, [email], 
//     function(err, user) {
//           if (err) { return cb(err); }
//           if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

//           crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//                   if (err) { return cb(err); }
//                   if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
//                     return cb(null, false, { message: 'Incorrect username or password.' });
//                   }
//                   return cb(null, user);
//                 });
//      });
//    };
//     passport.use(new LocalStrategy({ usernameField: 'email' }), authenticateUser)


// const genPassword = (password) => {
//    let salt = crypto.randomBytes(32).toString('hex');
//    let genHash = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex');

//    return {
//       salt: salt,
//       hash: genHash
//    };
// };

// const validPassword = (password, salt, hash) => {
//    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex');
//    return hash === hashVerify;
// }

module.exports = {initializePassport};
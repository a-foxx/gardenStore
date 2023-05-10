const pool = require('../db.js')
const crypto = require('crypto');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const passport = require('passport');
// const { emailExists, createUser, matchPassword } = require("./helper");
const { login } = require("./helper");

module.exports = (app) => {
  
  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser((id, done) => {
    done(null, { id });
  });

  // Configure local strategy to be use for local login
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await login({ email: username, password });
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    }
  ));

  return passport;

}



// function getUserByEmail(email) {
//   pool.query(`SELECT * FROM users WHERE email = $1`, [email], function(err, user) {
//     if(err) return null;
//     console.log('2', user.rows[0]);
//     if(!user) return null;

//     return user.rows[0]
//   })
// }

// module.exports = (passport) => {
// passport.use("local-signup", new LocalStrategy( {
//   usernameField: "email",
//   passwordField: "password",  
//   }, async (email, password, done) => {
//     try {
//     const userExists = await emailExists(email)
    
//     if (userExists) {
//     return done(null, false), console.log('user exists');
//     }
    
//     const user = await createUser(email, password);
//     return done(null, user);
//     } catch (error) {
//     done(error);
//           }
//         }
//       )
//     );
//   }

//   module.exports = (passport) => {
//       passport.use(
//         "local-login",
//         new LocalStrategy(
//           {
//             usernameField: "username",
//             passwordField: "password",
//           },
//           async (email, password, done) => {
//             try {
//               const user = await emailExists(email);
//               if (!user) return done(null, false, console.log('not found1'));
//               const isMatch = await matchPassword(password, user.password);
//               if (!isMatch) return done(null, false, console.log('not found'));
//               return done(null, user, console.log('good'));
//             } catch (error) {
//               return done(error, false);
//             }
//           }
//         )
//       );
//     };

    
// async function initializePassport(passport) {


    

    // const authenticateUser = async (email, password, done) => {

    //   pool.query(`SELECT * FROM users WHERE email = $1`, [email], function(err, res) {
        
    //     if(err) return null;
    //     if(!res.rows[0]) return null;
    //     const user = res.rows[0];
    //     console.log(user);
    //     if (user == null) {
    //       return done(null, false, {message: 'No user found'})
    //     } try {
    //       if (password != user.password) {
    //         console.log('bad password')
    //         return done(null, false, {message: 'password is incorrect'})
    //       } else {
    //         console.log('3', res)
    //         return done(null, res)
    //       }
    //     } catch(err) {
    //       console.log(err)
    //       return done(err)
    //     }
    //   })

    // }

// passport.use(new LocalStrategy({usernameField: 'email'}, emailExists));
// passport.serializeUser((user, done) => done(null, user))
// passport.deserializeUser((id, done) => done(null, getUserById(id)))

// }

//  module.exports = initializePassport

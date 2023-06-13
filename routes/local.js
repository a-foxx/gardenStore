const passport = require('passport');
const router = require('express').Router();
const pool = require('../db')
require("../passport/passport-config")(passport);

router.post(
  "/signup",
    passport.authenticate("local-signup", {failureFlash: true}),
    (req, res, next) => {
    res.json({
      user: req.user,
    });
    }
  );
  
router.post('/login', (req, res, next) => {
passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) return res.send({message: "Incorrect, please check credentials"});
    else {
    req.logIn(user, (err) => {
      
      
      if (err) { res.send({message: "Incorrect, please check credentials"}) };
        console.log('Login: ', req.sessionID)
        // req.session.userId = user.id; // Save the user ID in the session
        res.cookie('user', String(user.user_id))
        // console.log(user.user_id)
        req.session.save((err) => {
        if (err) {
            console.log('Error saving session:', err);
        }
        res.cookie('token', req.sessionID)
      
          return res.send({message: "Successfully Authenticated", sessionId: req.sessionID});

        });
      })
    }
  })(req, res, next);
})

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    const userSession = req.cookies.token
    pool.query(`DELETE from session WHERE sid = $1`, [userSession], (err, result) => {
      if (err) {
        throw err
      } else {
        res.clearCookie("session")
        // return res.json({message: 'logged out'});
      }
    })
    req.session.destroy((err) => {
      if (err) {
        return res.send({message: 'error'})
      } else {
        return res.json({message: 'logged out'});
      }
    })
    // res.json({message: 'logged out'});
    // res.redirect('/Home');
  });
});

module.exports = router;
const passport = require('passport');
const router = require('express').Router();

// authentication requests

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: 'Login success',
            user: req.user,
            cookies: req.cookies
        })
    }
})

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Login failure'
    })
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/Home')
})

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    successRedirect: 'http://localhost:3001/Home',
    failureRedirect: '/login/failed'
   })
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   }
  );

module.exports = router;
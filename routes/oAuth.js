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

// router.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/Home')
// })

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', 
  (err, user, info) => {
    console.log('info', user);
    if (err) throw err;
    if (!user) return res.send('No User Exists');
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        req.session.userId = user.id;
        res.cookie('user', String(user.user_id))
        // res.cookie('user_id', String(user.user_id))
        console.log(user.id);
        req.session.save((err) => {
          if (err) {
            console.log('Error saving session:', err);
          }
          res.cookie('token', req.sessionID)
            // return res.send({message: "Successfully Authenticated", sessionId: req.sessionID});
            return res.redirect('https://garden-store-frontend.vercel.app/Home')
          
        });
      })
    }
  })(req, res, next);
}
  );

  module.exports = router;

const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000;
const user = require('./routes/users')
const products = require('./routes/products')
const orders = require('./routes/orders')
const cart = require('./routes/cart')
const checkout = require('./routes/checkout')
const register = require('./routes/register')
const cartCont = require('./routes/cart-contents')
var passport = require('passport');
var oAuthSetup = require('./passport/oAuthSetup')
var oAuth = require('./routes/oAuth.js')
const pool = require('./db');
const flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
const pgsession = require('connect-pg-simple')(session);
var logger = require('morgan');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

const store = new pgsession({
  pool: pool,
  tableName: 'session'
})

app.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  cookie: { secure: true },
  store: store
}));

app.use(passport.initialize());  
app.use(passport.session());
require("./passport/passport-config")(passport);

app.post(
  "/auth/signup",
    passport.authenticate("local-signup", {failureFlash: true}),
    (req, res, next) => {
    res.json({
      user: req.user,
    });
    }
  );
  
  app.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) throw err;
      if (!user) return res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          console.log('Login: ', req.sessionID)
          req.session.userId = user.id; // Save the user ID in the session
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

// oAuth
app.use('/auth', oAuth)


// register
app.get('/register', register.create)
app.post('/register', register.create)

// // login
app.get('/checkedLoggedIn', function (req, res) {
const userSession = req.headers.cookie?.split('token=')[1]
pool.query(`SELECT * from session WHERE sid = $1`, [userSession], (err, result) => {
  // console.log(session);
  if (err) {
    throw err; 
  }
  if(result.rows.length > 0) {
    return res.send({message: true})
  } else {
    return res.send({message: false})
  }
})
})

app.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    const userSession = req.headers.cookie?.split('token=')[1]
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

/*users*/
app.get('/users', user.getUsers)
app.post('/adduser', user.createUser)
app.delete('/deleteuser/:id', user.deleteUser)
app.put('/updateuser/:id', user.updateUser)

/*products*/
app.get('/products', products.getProducts)
app.get('/getProduct/:id', products.getOneProduct)
app.post('/addproduct', products.createProduct)
app.delete('/deleteproduct/:id', products.deleteProduct)
app.put('/updateproduct/:id', products.updateProducts)

// orders
app.get('/orders', orders.getOrders)
app.post('/createorder', orders.createOrder)
app.delete('/deleteorder/:id', orders.deleteOrder)
app.put('/updateorder/:id', orders.updateOrder)

/*cart*/
app.get('/cart', cart.getCart)
app.post('/addtocart', cart.addToCart)
app.delete('/deletecart/:id', cart.deleteCart)
app.put('/updatecart/:id', cart.updateCart)

// cart-contents
app.get('/cart-contents', cartCont.getCartContents)
app.get('/addCartContents', cartCont.addCartContents)
app.get('/deleteCartContents', cartCont.deleteCartContents)

// checkout
app.get('/getCheckout', checkout.getCheckout)
app.post('/postCheckout', checkout.postCheckout)
app.delete('/deleteCheckout', checkout.deleteCheckout)
app.put('/updateCheckout', checkout.deleteCheckout)


app.listen(port, () => console.log(`Example backend API listening on port ${port}!`))

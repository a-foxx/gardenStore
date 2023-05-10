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
const pool = require('./db');
const flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var csrf = require('csurf');
var logger = require('morgan');
var router = express.Router();
require("./passport/passport-config")(passport);
var passport = require('passport');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(cors());
// app.use(passport.authentication('session'));
// app.use(session());
app.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  // store: pool
}));

app.use(passport.initialize());  

app.post(
    "/auth/signup",
    passport.authenticate("local-signup", { session: false }),
    (req, res, next) => {
      res.json({
        user: req.user,
      });
    }
  );
  
  app.post(
    "/auth/login",
    passport.authenticate("local", { session: false }),
    (req, res, next) => {
      console.log('hello')
      res.json({ user: req.user });
      
    }
  );

// router.post('/login', checkAuthenticated, passport.authenticate('local', {successRedirect : '/successjson', failureFlash: true}))

// router.get('/successjson', function(req, res) {
//   res.send({message: 'True success!'});
// });

// function checkAuthenticated(req, res, next) {
//   if (!req.user) {
//     res.render('home');
//     res.send({message: 'failed login'})
//   } else {
//     next();
//   }
// }

// register
app.get('/register', register.create)
app.post('/register', register.create)

// // login
// app.get('/checkedLoggedIn', function (req, res) {
//   console.log(req.session)
//   if (req.session) {
//     return res.send({message: true})
//   } else {
//     res.send({message: false})
//   }
// })

//logout
// app.get('/logout', function (req, res) {
//   req.logout((error) => {
//   if (error) {
//     console.log(error);
//   }
//   res.send({message: 'logged out'})
//     } 
//   )} 
// )

app.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/Home');
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

// checkout
app.get('/getCheckout', checkout.getCheckout)
app.post('/postCheckout', checkout.postCheckout)
app.delete('/deleteCheckout', checkout.deleteCheckout)
app.put('/updateCheckout', checkout.deleteCheckout)


app.listen(port, () => console.log(`Example backend API listening on port ${port}!`))

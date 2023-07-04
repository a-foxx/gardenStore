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
var stripeEndpoint = require('./stripeServer')
var passport = require('passport')
var local = require('./routes/local')
var oAuthSetup = require('./passport/oAuthSetup')
var oAuth = require('./routes/oAuth.js')
const pool = require('./db');
const flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
const pgsession = require('connect-pg-simple')(session);
var logger = require('morgan');
var bodyParser = require('body-parser')
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(flash());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
app.use(bodyParser.json());

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

// local 
app.use('/auth', local)

// oAuth
app.use('/auth', oAuth)

// stripe
app.use('/stripe', stripeEndpoint)


// register
app.get('/register', register.create)
app.post('/register', register.create)

// // login
app.get('/checkedLoggedIn', function (req, res) {
  const userSession = req.cookies.token
  pool.query(`SELECT * from session WHERE sid = $1`, [userSession], (err, result) => {
  // console.log(session);
  if (err) {
    throw err; 
  }
  if(result.rows.length === 0) {
    return res.status(401).send({message: false})

  } else {
    return res.status(200).send({message: true})
  }
})
})


/*users*/
app.get('/users', user.getUsers)
app.get('/getUser', user.getUser)
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
app.get('/getUserOrder', orders.getUserOrder)
app.post('/createorder', orders.createOrder)
app.delete('/deleteorder/:id', orders.deleteOrder)
app.put('/updateorder', orders.updateOrder)

/*cart*/
app.get('/cart', cart.getCart)
app.get('/getUserCart', cart.getUsersCart)
app.post('/checkCarts', cart.checkCartExists)
app.post('/addtocart', cart.addToCart)
app.delete('/deleteCart', cart.deleteCart)
app.delete('/deleteCartItem', cart.deleteCartItem)
app.put('/updateUserCart', cart.updateCart)
app.put('/CartQtyIncrease', cart.increaseQty)

// checkout
app.get('/getCheckout', checkout.getCheckout)
app.post('/postCheckout', checkout.postCheckout)
app.delete('/deleteCheckout', checkout.deleteCheckout)
app.put('/updateCheckout', checkout.deleteCheckout)


app.listen(port, () => console.log(`Example backend API listening on port ${port}!`))

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
const passport = require('passport');
const session = require('express-session');
const initializePassport = require('./passport-config')
const pool = require('./db');
const flash = require('express-flash')


initializePassport(passport);

app.use(session({
  // store: pool,
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false
}))


app.use(cors())
app.use(express.json())
app.use(flash());
app.use(
  express.urlencoded({
    extended: true
  })
)


app.post('/login', checkAuthenticated, passport.authenticate('local', {successRedirect : '/successjson', failureFlash: true}))

app.get('/successjson', function(req, res) {
  res.send({message: 'True success!'});
});

function checkAuthenticated(req, res, next) {
  // console.log('rabbit', req)
  if (req.user == undefined) {
    return res.send({message: 'logged in'})
  } else {
    next();
  }
}

app.get('/', function (req, res) {
  res.send('Way To Go Bro');
});

// register
app.get('/register', register.create)
app.post('/register', register.create)

// login
app.get('/checkedLoggedIn', function (req, res) {
  console.log(req.session)
  if (req.user) {
    return res.send({message: true})
  } else {
    res.send({message: false})
  }
})

//logout
app.get('/logout', function (req, res) {req.session.destroy((error) => {
  if (error) {
    console.log('dogs', error);
  }
  res.send({message: 'logged out'})
} )} )



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

const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000;
const user = require('./routes/users')
const products = require('./routes/products')
const orders = require('./routes/orders')
const cart = require('./routes/cart')
const register = require('./routes/register')
const passport = require('passport');
const session = require('express-session');
// const initializePassport = require('./passport-config')
const pool = require('./db');
const LocalStrategy = require('passport-local').Strategy

// initializePassport();

app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)



// app.get('/', (req, res) => {
//   res.send('failed');
// });

passport.use(new LocalStrategy(

  (username, password, done) => {
    pool.query('SELECT * FROM users WHERE email = ?', [username], (error, results) => {
      console.log(username, password);
      if (error) {
        return done(error);
      }
      if (results.length === 0) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      const user = results[0];
      console.log(user);
      if (password !== user.password) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    });
  }
));

app.use(session({
  store: pool,
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/' }),
  (req, res) => {
    console.log(res);
        if (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(results);
  }
);

// app.get('/users', passport.authenticate('local', { session: false }), (req, res) => {
//   db.query('SELECT * FROM users', (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     res.json(results);
//   });
// });




//login
// app.get('/login', login.?) 
// app.post('http://localhost:3000/login/password', (req, res) => {
//   res.send('Logged in');
// })


// app.get("/login/password",
//   passport.authenticate(initializePassport, { failureRedirect : "/"}),
//   (req, res) => {
    
//   }
// );

// app.get("/profile", (req, res) => {
//   res.render("profile", { user: req.user });
// }); 


// app.use(initializePassport());

// app.use(session({
//   secret:'my-secret',
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // passport.use(new LocalStrategy({ usernameField: 'email' }), authenticateUser)

// passport.use(initializePassport.initialize());

// app.post('/login/password',
//   passport.authenticate('local', { failureRedirect: '/', failureMessage: true }),
//   function(req, res) {
//     res.redirect('/~' + req.user.username);
//   });

app.get('/', function (req, res) {
  res.send('Way To Go Bro');
});

// register
app.get('/register', register.create)
app.post('/register', register.create)

/*users*/
app.get('/users', user.getUsers)
app.post('/adduser', user.createUser)
app.delete('/deleteuser/:id', user.deleteUser)
app.put('/updateuser/:id', user.updateUser)

/*products*/
app.get('/products', products.getProducts)
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


app.listen(port, () => console.log(`Example backend API listening on port ${port}!`))

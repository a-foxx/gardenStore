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
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isOriginAllowed = true;

    if (isOriginAllowed) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials
}));

// app.use(cors({
//   origin: "http://garden-store-frontend.vercel.app",
//   credentials: true
// }));

app.use(bodyParser.json());

const store = new pgsession({
  pool: pool,
  tableName: "session"
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

// swagger docs

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
      title: 'ecommerce REST API',
      version: '1.0.0',
      description: 'API documentation for the To-do application',
  },
  host: 'https://garden-store-backend.vercel.app/',
  basePath: '/',
  components: {
      schemas: {
          users: {
              type: 'object',
              required: ['user_id', 'email', 'hashed_password', 'first_name', 'last_name'],
              properties: {
                  user_id: {
                      type: 'uuid',
                      description: 'uuid for each user, PUBLIC KEY'
                  },
                  email: {
                      type: 'string',
                      description: "user's email address",
                  },
                  hashed_password: {
                      type: 'string',
                      description: "user's hashed password",
                  },
                  first_name: {
                    type: 'string',
                    description: "users first name",
                },
                  last_name: {
                    type: 'string',
                    description: "users last name",
                },
              },
          },
          session: {
              type: 'object',
              required: ['sid', 'sess', 'expires'],
              properties: {
                  sid: {
                      type: 'uuid',
                      description: 'id for each session'
                  },
                  sess: {
                      type: 'json',
                      description: 'session data'
                  },
                  expires: {
                      type: 'timestamp without time zone',
                      description: 'expiry of session'
                  }
              }
          },
          products: {
              type: 'object',
              required: ['product_id', 'name', 'price', 'description', 'image'],
              properties: {
                product_id: {
                  type: 'uuid',
                  description: 'id for each product'
                },
                name: {
                  type: 'string',
                  description: 'product name'
                },
                price: {
                  type: 'integer',
                  description: 'price'
                },
                description: {
                  type: 'string',
                  description: 'product description'
                },
                image: {
                  type: 'string',
                  description: 'url of image source'
                }
            }
          },
          orders: {
              type: 'object',
              required: ['order_id', 'total', 'status', 'created', 'user_id', 'cart_contents'],
              properties: {
                order_id: {
                  type: 'uuid',
                  description: 'id for order'
                },
                total: {
                  type: 'integer',
                  description: 'order total cost'
                },
                status: {
                  type: 'string',
                  description: 'confirms order is paid after successful stripe payment'
                },
                created: {
                  type: 'string',
                  description: 'timestamp of creation'
                },
                user_id: {
                  type: 'uuid',
                  description: 'FOREIGN KEY references users table, to id users account'
                },
                cart_contents: {
                  type: 'json',
                  description: 'holds all the data about the purchased cart'
                }
              }
          },
          carts: {
              type: 'object',
              required: ['cart_id', 'created', 'product_id', 'quantity'],
              properties: {
                cart_id: {
                  type: 'uuid',
                  description: 'id for cart'
                },
                created: {
                  type: 'string',
                  description: 'timestamp for creation of cart'
                },
                product_id: {
                  type: 'string',
                  description: 'FOREIGN KEY references products table in cart'
                },
                quantity: {
                  type: 'integer',
                  description: 'quantity of product in cart'
                }
              }
          }
      },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


module.exports = app

const Pool = require('pg').Pool
// const { user, host, database, password, port } = require("./db-config");
require('dotenv').config()

// const devConfig = {
//   user: process.env.PG_USERNAME,
//   password: process.env.PG_PASSWORD,
//   host: process.env.PG_HOST,
//   port: process.env.PG_DBPORT,
//   database: process.env.PG_DB
// }

// const pool = new Pool(devConfig)

//vercel
const pool = new Pool({

  connectionString: process.env.POSTGRES_URL + "?sslmode=require",

})

pool.connect((err) => {
  if (err) throw err
  console.log('connected to postgreSQL successfully')
})

module.exports = pool;

/*
// pool.query(

    CREATE TABLE users (
      user_id UUID NOT NULL PRIMARY KEY,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(150) NOT NULL,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(150) NOT NULL,
      g_profile_id VARCHAR(150)
    )

    CREATE TABLE session (
      sid VARCHAR(150) NOT NULL PRIMARY KEY,
      sess JSON NOT NULL,
      expire VARCHAR(50)
    )


    
  
    CREATE TABLE IF NOT EXISTS products (
        product_id      UUID             NOT NULL PRIMARY KEY,
        name            VARCHAR(50)     NOT NULL,
        price           INT             NOT NULL,
        description     VARCHAR(100)     NOT NULL,
        image           VARCHAR(300)     NOT NULL
      );
    
  
    CREATE TABLE orders (
        order_id          UUID            NOT NULL PRIMARY KEY,
        total             INT             NOT NULL,
        status            VARCHAR(50)     NOT NULL,
        created           VARCHAR(50)     NOT NULL,
        user_id           UUID            NOT NULL,
        cart_contents     JSON            NOT NULL,
        shipping_address  VARCHAR(200)    NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    
    CREATE TABLE carts (
        cart_id         UUID            NOT NULL PRIMARY KEY,
        created         VARCHAR(50)     NOT NULL,
        product_id      VARCHAR(150)    NOT NULL,
        quantity        INT             NOT NULL,
        user_id         VARCHAR(250),    
        g_profile_id    VARCHAR(150)    
      );


module.exports = pool;

*/
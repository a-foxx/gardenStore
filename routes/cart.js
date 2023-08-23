const pool = require('../db')
const { v4: uuidv4 } = require('uuid');

// swagger
/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Get all carts
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Carts fetched successfully
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     carts:
 *       type: object
 *       required:
 *         - cart_id
 *         - created
 *         - product_id
 *         - quantity
 *       properties:
 *         cart_id:
 *           type: uuid
 *           description: id for cart
 *         created:
 *           type: string
 *           description: timestamp for creation of cart
 *         product_id:
 *           type: string
 *           description: FOREIGN KEY references products table in cart
 *         quantity:
 *           type: integer
 *           description: quantity of product in cart
 */

const getCart = (req, res) => {
    pool.query(
        `SELECT * FROM carts`, (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                data: result.rows
            })
        }
    )
}

async function getProductFromProductId(product_id) {
    const result = await pool.query(`SELECT * FROM products WHERE product_id = $1;`, [product_id])
    return result.rows[0]
}

const getUsersCart = async (req, res) => {
    const user_id = req.cookies.user;
      const result = await pool.query('SELECT * FROM carts WHERE user_id = $1;', [user_id]);
      const cartItems = result.rows;
    //   console.log(cartItems)
  
      const final = await Promise.all(
        cartItems.map(async (product) => {
          const productDetails = await getProductFromProductId(product.product_id);
          return { ...product, ...productDetails };
        })
      );
      res.header('Access-Control-Allow-Origin', ['http://localhost:3000','https://garden-store-frontend.vercel.app']);
      res.status(200).json(final);
    //   console.log('final: ',final);
  };

const addToCart = (req, res) => {
    const user_id = req.cookies.user;
    const {product_id} = req.body;
    let quantity = 1;
    const created = new Date();
    const id = uuidv4();

    pool.query(
        `INSERT INTO carts (cart_id, created, product_id, quantity, user_id) VALUES (
            $1, $2, $3, $4, $5
        ) RETURNING *;`, [id, created, product_id, quantity, user_id], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                message: 'product added',
                data: result.rows[0]
            })
        }
    )
}

const checkCartExists = (req, res) => {
    const user_id = req.cookies.user;
    const product_id = req.body;
    pool.query(`
    SELECT * FROM carts WHERE user_id = $1 AND product_id = $2;`, 
    [user_id, product_id.product_id], (err, result) => {
        // console.log('cart endpoint data: ', user_id, product_id.product_id);
        if (err) throw err;
        if (result.rows.length >= 1) {
            res.status(200).json({
                message: true,
                data: result.rows
            })
        } else {
            res.status(200).json({
                message: false,
                data: result.rows
            })
        }
    })
}

const deleteCart = (req, res) => {
    const user_id = req.cookies.user;
    console.log(user_id)
    pool.query(
        `DELETE FROM carts WHERE user_id = $1;`, [user_id], (err, result) => {
            if (err) {
                return res.status(500).json('Error has occurred')
            }
            res.json({
                message: 'cart deleted'
            })
        }
    )
}

const deleteCartItem = (req, res) => {
    const user_id = req.cookies.user;
    const { product_id } = req.body;
    console.log('user', user_id)
    console.log('req.body p_id', req.body)
    pool.query(`DELETE FROM carts WHERE user_id = $1 AND product_id = $2;`, [user_id, product_id], (error, result) => {
        if (error) throw error
        res.json({
            message: 'Product removed from cart'
        })
    })
}

const updateCart = (req, res) => {
    const {cart_id, quantity, product_id} = req.body;
    const created = new Date();
    const user_id = req.cookies.user;
    // console.log('body ', cart_id);

    pool.query(
        `UPDATE carts SET created = $1, product_id = $2, quantity = $3, user_id = $4 WHERE cart_id = $5`, 
        [created, product_id, quantity, user_id, cart_id], 
        (err, result) => {
            if (err) {
                throw err;
            }
            res.json({
                message: 'cart updated'
            })
        }
    )
}
// from products component
const increaseQty = (req, res) => {
    const user_id = req.cookies.user;
    const product_id = req.body;

    pool.query(`UPDATE carts SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2;`, [user_id, product_id.product_id], (err, result) => {
        if (err) throw err;
        res.status(200).json({
            message: 'quantity updated'
        })
    })

}


module.exports = {increaseQty, getCart, checkCartExists, addToCart, deleteCart, updateCart, getUsersCart, deleteCartItem }
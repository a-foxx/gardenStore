const pool = require('../db')

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
      res.status(200).json(final);
    //   console.log('final: ',final);
  };

const addToCart = (req, res) => {
    const user_id = req.cookies.user;
    const {product_id} = req.body;
    let quantity = 1;
    const created = new Date();

    pool.query(
        `INSERT INTO carts (created, product_id, quantity, user_id) VALUES (
            $1, $2, $3, $4
        ) RETURNING *;`, [created, product_id, quantity, user_id], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                message: 'order created',
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
    const cartId = req.params.id;
    pool.query(
        `DELETE FROM carts WHERE cart_id = $1;`, [cartId], (err, result) => {
            if (err) {
                throw err;
            }
            res.json({
                message: 'cart deleted'
            })
        }
    )
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


module.exports = {increaseQty, getCart, checkCartExists, addToCart, deleteCart, updateCart, getUsersCart }
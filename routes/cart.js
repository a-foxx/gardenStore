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

const addToCart = (req, res) => {
    const user_id = req.cookies.user;
    const {created, product_id, quantity} = req.body;
    
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
    const {created, product_id, quantity} = req.body;
    const user_id = req.cookies.user;
    pool.query(
        `UPDATE carts SET created = $1, product_id = $2, quantity = $3 user_id = $4`, [created, product_id, quantity, user_id], (err, result) => {
            if (err) {
                throw err;
            }
            res.json({
                message: 'cart updated'
            })
        }
    )
}

module.exports = { getCart, addToCart, deleteCart, updateCart }
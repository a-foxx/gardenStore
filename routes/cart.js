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
    const {modified, created, quantity, user_id, product_id} = req.body;
    pool.query(
        `INSERT INTO carts (modified, created, quantity, user_id, product_id) VALUES (
            $1, $2, $3, $4, $5
        ) RETURNING *;`, [modified, created, quantity, user_id, product_id], (err, result) => {
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
    const {modified, created, quantity, user_id, product_id} = req.body;
    const cartId = req.params.id;
    pool.query(
        `UPDATE carts SET modified = $1, created = $2, quantity = $3, user_id = $4, product_id = $5 WHERE cart_id = $6;`, [modified, created, quantity, user_id, product_id, cartId], (err, result) => {
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
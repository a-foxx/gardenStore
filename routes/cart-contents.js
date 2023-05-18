const pool = require('../db')

const getCartContents = (req, res) => {
    pool.query(
        `SELECT * FROM cart-contents`, (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                data: result.rows
            })
        }
    )
}

const addCartContents = (req, res) => {
    const session_id = req.cookies.token;
    const {product_id, quantity} = req.body
    pool.query(
        `INSERT INTO cart-contents (product_id, quantity, session_id) VALUES (
            $1, $2, $3
        ) RETURNING *;`, [product_id, quantity, session_id], (err, result) => {
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

const deleteCartContents = (req, res) => {
    const session_id = req.params.id;
    pool.query(
        `DELETE FROM cart-contents WHERE session_id = $1` [session_id], (err,result) => {
            if (err) {
                throw err;
            }
            res.json({
                message: 'cart deleted'
            })
        }
    )
}

module.exports = { getCartContents, addCartContents, deleteCartContents }
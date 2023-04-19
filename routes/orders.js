const pool = require('../db')

//get orders
const getOrders = (req, res) => {
    pool.query(
        `SELECT * FROM orders`, (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                data: result.rows
            })
        })
}

// post order
const createOrder = (req, res) => {
    //foreign key userid, cart_id
    const {total, status, created, modified, user_id, cart_id} = req.body;
    console.log(req.body);
    pool.query(
        `INSERT INTO orders (total, status, created, modified, user_id, cart_id)
        VALUES (
            $1, $2, $3, $4, $5, $6
        ) RETURNING *;`, [total, status, created, modified, user_id, cart_id], (err, result) => {
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

// delete order
const deleteOrder = (req, res) => {
    const orderId = req.params.id;
    pool.query(
        `DELETE FROM orders WHERE order_id = $1`, [orderId], (err, result) => {
            if (err) {
                throw err;
            }
            res.json({
                message: 'order deleted'
            })
        }
    )
}

// update order
const updateOrder = (req, res) => {
    //cartid added???
    const orderId = req.params.id;
    const {total, status, created, modified, user_id, cart_id} = req.body;
    pool.query(
        `UPDATE orders SET total = $1, status = $2, created = $3, modified = $4, user_id = $5, cart_id = $6 WHERE order_id = $7;`, [total, status, created, modified, user_id, cart_id, orderId], 
        (err, result) => {
            if (err) {
                throw err;
            }
            res.json({
                message: 'order updated'
            })
        })
}

module.exports = { getOrders, createOrder, deleteOrder, updateOrder }
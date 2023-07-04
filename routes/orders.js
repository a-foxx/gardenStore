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
    const created = new Date();
    const user_id = req.cookies.user;
    //foreign key userid, cart_id
    const {total, status, cart_contents, shipAddress} = req.body;
    console.log(req.body)
    const jsonData = JSON.stringify(cart_contents);
    pool.query(
        `INSERT INTO orders (total, status, created, user_id, cart_contents, shipping_address)
        VALUES (
            $1, $2, $3, $4, $5, $6
        ) RETURNING *;`, [total, status, created, user_id, jsonData, shipAddress], (err, result) => {
            if (err) {
                return res.status(500).json('Error has occurred')
            }
            res.cookie('order_id', result.rows[0].order_id)   
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
    const order_id = req.cookies.order_id;
    const {status} = req.body;
    console.log('o_id', order_id)
    pool.query(
        `UPDATE orders SET status = $1 WHERE order_id = $2;`, [status, order_id], 
        (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                message: 'order has been paid'
            })
        })
}

const getUserOrder = (req, res) => {
    const user_id = req.cookies.user;
    pool.query(
        `SELECT * FROM orders WHERE user_id = $1 AND status = 'PAID'`, [user_id], (err, result) => {
            if (err) {
                throw err
            }
            res.status(200).json({
                message: 'orders found',
                data: result.rows
            })
        }
    )
}

module.exports = { getOrders, createOrder, deleteOrder, updateOrder, getUserOrder }

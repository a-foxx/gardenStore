const pool = require('../db')
const { v4: uuidv4 } = require('uuid');

// swagger
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Orders fetched successfully
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     orders:
 *       type: object
 *       required:
 *         - order_id
 *         - total
 *         - status
 *         - created
 *         - user_id
 *         - cart_contents
 *       properties:
 *         order_id:
 *           type: uuid
 *           description: id for order
 *         total:
 *           type: integer
 *           description: order total cost
 *         status:
 *           type: string
 *           description: confirms order is paid after successful stripe payment
 *         created:
 *           type: string
 *           description: timestamp of creation
 *         user_id:
 *           type: uuid
 *           description: FOREIGN KEY references users table, to id users account
 *         cart_contents:
 *           type: json
 *           description: holds all the data
*/

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
    const id = uuidv4()
    const {total, status, cart_contents, shipAddress} = req.body;
    // console.log(req.body)
    const jsonData = JSON.stringify(cart_contents);
    pool.query(
        `INSERT INTO orders (order_id, total, status, created, user_id, cart_contents, shipping_address)
        VALUES (
            $1, $2, $3, $4, $5, $6, $7
        ) RETURNING *;`, [id, total, status, created, user_id, jsonData, shipAddress], (err, result) => {
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
    // console.log('o_id', order_id)
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

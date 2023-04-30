const pool = require('../db')

const getCheckout = (req, res) => {
    pool.query(
        `SELECT * from checkout`, (err, result) => {
            if(err) {
                console.log(err)
                throw err
            }
            res.status(200).json({
                data: result.rows
            })
        })
}

const postCheckout = (req, res) => {
    pool.query(
        `INSERT INTO checkout () VALUES () RETURNING *;`, [], (err, result) => {
            if(err) {
                console.log(err)
                throw err
            }
            res.status(200).json({
                message: 'checkout created',
                data: result.rows[0]
            })
        }
    )
}

const deleteCheckout = (req, res) => {
    pool.query(
        `DELETE FROM checkout WHERE checkout_id = ?;`, [checkout_id], (err, result) => {
            if(err) {
                console.log(err)
                throw err
            }
            res.json({
                message: 'Checkout entry deleted'
            })
        })
}

const updateCheckout = (req, res) => {

}

module.exports = {getCheckout, postCheckout, deleteCheckout, updateCheckout};
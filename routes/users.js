const Pool = require('pg').pool;
const pool = require('../db')

// get users
const getUsers = (req, res) => {
    pool.query(
        `SELECT * FROM users`, (err, result) => {
            if(err) {
                console.log(err)
                throw err
            }
            res.status(200).json({
                data: result.rows
            })
        })
}

// post users
const createUser = (req, res) => {
    console.log(req.body)
    const {email, password, firstName, lastName} = req.body;
    
    pool.query(
        `INSERT INTO users (email, password, first_name, last_name)
        VALUES (
            $1, $2, $3, $4
        ) RETURNING *;`, [email, password, firstName, lastName], (err, result) => {
            if(err) {
                console.log(err)
                throw err
            }
            res.status(200).json({
                message: 'user created',
                data: result.rows[0]
            })
        })
}

// delete users
const deleteUser = (req, res) => {
    const userId = req.params.id;
    pool.query(`DELETE FROM users WHERE user_id = $1`, [userId], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({
            message: 'user deleted'
        })
    })
}

// update users
const updateUser = (req, res) => {
    const {email, password, firstname, lastname} = req.body;
    const id = req.params.id;
    pool.query(`UPDATE users SET email = $1, password = $2, first_name = $3, last_name = $4 WHERE user_id = $5`, [email, password, firstname, lastname, id], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({
            message: 'user updated'
        })
    })
}


module.exports = {createUser, getUsers, deleteUser, updateUser};
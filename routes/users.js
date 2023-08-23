// const Pool = require('pg').pool;
const pool = require('../db')
const { v4: uuidv4 } = require('uuid');

// swagger
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Users fetched successfully
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - user_id
 *         - email
 *         - hashed_password
 *         - first_name
 *         - last_name
 *       properties:
 *         user_id:
 *           type: uuid
 *           description: id for each user
 *         email:
 *           type: string
 *           description: user's email address
 *         hashed_password:
 *           type: string
 *           description: user's hashed password
 *         first_name:
 *           type: string
 *           description: users first name
 *         last_name:
 *           type: string
 *           description: users last name
 */


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

// get one user
const getUser = (req, res) => {
    const user_id = req.cookies.user;
    let query;
    let queryParams;
        query = `SELECT * FROM users WHERE user_id = $1`;
        queryParams = [user_id];

    pool.query(
        query,
        queryParams,
        (err, result) => {
            if (err) throw err;
            res.status(200).json({
                data: result.rows
            });
            console.log(result)
        }
    );
};

// post users
const createUser = (req, res) => {
    const id = uuidv4();
    const {email, password, firstName, lastName} = req.body;
    
    pool.query(
        `INSERT INTO users (user_id, email, password, first_name, last_name)
        VALUES (
            $1, $2, $3, $4, $5
        ) RETURNING *;`, [id, email, password, firstName, lastName], (err, result) => {
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


module.exports = {createUser, getUsers, getUser, deleteUser, updateUser};
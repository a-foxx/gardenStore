const bcrypt = require('bcrypt')
const pool = require('../db')
const express =  require('express');
const router = express.Router();
const app = express();

const create = async (req, res) => {
    const {firstName, lastName, email, password} = req.body
        // const hashedPassword =
//     bcrypt.genSalt(salt, function (err, salt) {
//     bcrypt.hash(req.body.password, salt, function(err, hash) {
//     })
// })
    try {
        const password = await bcrypt.hash(req.body.password, 10);
    
        pool.query(
            `INSERT INTO users (email, password, first_name, last_name)
            VALUES (
                $1, $2, $3, $4
            ) RETURNING *;`, [email, password, firstName, lastName], (err, result) => {
                res.status(200).json({
                    message: 'user created',
                    // data: result.rows[0]
                })
                console.log(req.body);
            })   
    } catch (err) { 
        // res.redirect('/register')
        console.log(err)
        throw err
    }
}


module.exports = { create }
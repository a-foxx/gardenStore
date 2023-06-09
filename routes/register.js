const bcrypt = require('bcrypt')
const pool = require('../db')
const express =  require('express');
// const router = express.Router();
// const app = express();

const create = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    const ifUserExists = () => {
        pool.query(`SELECT * FROM users where email = $1`, [email], (error, result) => {
            if (error) throw error;
            if (result.rows.length > 0) {
                res.send({
                    message: 'Email exists, please login'
                })
            } else {
                res.status(200)
            }
        })
    }

    try {
        ifUserExists();

        if (ifUserExists.status === 200) {
            const password = await bcrypt.hash(req.body.password, 10);
            // console.log('Query', req.body)
            pool.query(
                `INSERT INTO users (email, password, first_name, last_name)
                VALUES (
                    $1, $2, $3, $4
                ) RETURNING *;`, [email, password, firstName, lastName], (err, result) => {
                    res.status(200).json({
                        message: 'user created',
                        // data: result.rows[0]
                    })
                    // console.log(req.body);
                })   
            } else {
                return res.status.message
            }
            
        } catch (err) { 
            // res.redirect('/register')
            console.log(err)
            throw err
        }
}



module.exports = { create }


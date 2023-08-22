const bcrypt = require('bcrypt')
const pool = require('../db')
const { v4: uuidv4 } = require('uuid');

// const router = express.Router();
// const app = express();

// const create = async (req, res) => {
//     const {firstName, lastName, email, password} = req.body;
//     const id = uuidv4()

//     const ifUserExists = () => {
//         pool.query(`SELECT * FROM users where email = $1`, [email], (error, result) => {
//             if (error) throw error;
//             if (result.rows.length > 0) {
//                 res.send({
//                     message: 'Email exists, please login'
//                 })
//             } else {
//                 res.status(200)
//             }
//         })
//     }

//     try {
//         ifUserExists();

//         if (ifUserExists.status === 200) {
//             const password = await bcrypt.hash(req.body.password, 10);
//             // console.log('Query', req.body)
//             pool.query(
//                 `INSERT INTO users (user_id, email, password, first_name, last_name)
//                 VALUES (
//                     $1, $2, $3, $4, $5
//                 ) RETURNING *;`, [id, email, password, firstName, lastName], (err, result) => {
//                     res.header('Access-Control-Allow-Origin', 'https://garden-store-frontend.vercel.app');
//                     res.status(200).json({
//                         message: 'user created',
//                         // data: result.rows[0]
//                     })
//                     // console.log(req.body);
//                 })   
//             } else {
//                 return res.status.message
//             }
            
//         } catch (err) { 
//             // res.redirect('/register')
//             console.log(err)
//             throw err
//         }
// }

const create = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const id = uuidv4();

    try {
        const userExistsResult = await pool.query(`SELECT * FROM users where email = $1`, [email]);
        if (userExistsResult.rows.length > 0) {
            return res.send({
                message: 'Email exists, please login'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserResult = await pool.query(
            `INSERT INTO users (user_id, email, password, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            [id, email, hashedPassword, firstName, lastName]
        );

        res.header('Access-Control-Allow-Origin', 'https://garden-store-frontend.vercel.app');
        res.status(200).json({
            message: 'User created',
            data: insertUserResult.rows[0]
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'An error occurred while creating the user'
        });
    }
};


module.exports = { create }


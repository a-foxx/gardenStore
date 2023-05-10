const pool = require("../db");
const bcrypt = require('bcrypt');
const createError = require('http-errors');

 const findOneByEmail = async (email) => {
  try {

    // Generate SQL statement
    const statement = `SELECT *
                       FROM users
                       WHERE email = $1`;
    const values = [email];

    // Execute SQL statment
    const result = await pool.query(statement, values);

    if (result.rows?.length) {
      return result.rows[0]
    }

    return null;

  } catch(err) {
    throw new Error(err);
  }
};

const login = async (data) => {

  const { email, password } = data;

  try {
    // Check if user exists
    const user = await findOneByEmail(email);

    // If no user found, reject
    if (!user) {
      throw createError(401, 'Incorrect username or password1');
    }

    // Check for matching passwords
    // const match = await bcrypt.compare(password, hashPassword);
    // if(password === hashPassword) 
    // return match

    if (user.password !== password) {
      throw createError(401, 'Incorrect username or password2');
    }

    return user;

  } catch(err) {
    throw createError(500, err);
  }

};




// const emailExists = async (email) => {
//     const data = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
//     if (data.rowCount == 0) return false; 
//     return data.rows[0], console.log(data.rows[0]);

//   }

//   const matchPassword = async (password, hashPassword) => {
//     const match = await bcrypt.compare(password, hashPassword);
//     // if(password === hashPassword) 
//     return match
//     };

//     const createUser = async (email, password) => {
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(password, salt);

//         const data = await pool.query(
//         "INSERT INTO users(email, password) VALUES ($1, $2) RETURNING id, email, password",
//         [email, hash]
//         );
    
//         if (data.rowCount == 0) return false;
//         return data.rows[0];
//         };

//         module.exports = { emailExists, createUser, matchPassword };
module.exports = { login, findOneByEmail };
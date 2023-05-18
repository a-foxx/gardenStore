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
console.log(result)
    return null;

  } catch(err) {
    throw err;
  }
};

const login = async (data) => {

  const { email, password } = data;

  try {
    // Check if user exists
    const user = await findOneByEmail(email);

    // If no user found, reject
    if (!user) {
      throw createError(401, 'Email not registered');
    }

    // Check for matching passwords
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
      throw createError(401, 'Password incorrect')
      // res.status(400).json({ message: "Invalid password or email" });
    } 
  return user;

  } catch(err) {
    throw createError(500, err);
  }

};

module.exports = { login, findOneByEmail };
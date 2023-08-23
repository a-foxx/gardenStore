const pool = require('../db')
const { v4: uuidv4 } = require('uuid');

// swagger
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Products fetched successfully
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     products:
 *       type: object
 *       required:
 *         - product_id
 *         - name
 *         - price
 *         - description
 *         - image
 *       properties:
 *         product_id:
 *           type: uuid
 *           description: id for each product
 *         name:
 *           type: string
 *           description: product name
 *         price:
 *           type: integer
 *           description: price
 *         description:
 *           type: string
 *           description: product description
 *         image:
 *           type: string
 *           description: url of image source
 */

// Your route handler for products goes here...


//get products
const getProducts = (req, res) => {
    pool.query('SELECT * FROM products', (error, result) => {
      if (error) {
        console.log(error)
        throw error;
      }
    res.send(result.rows);
    })
}

// get one product
const getOneProduct = (req, res) => {
    const productId = req.params.id;
    pool.query(`SELECT * FROM products WHERE product_id = $1`, [productId], (error, result) => {
        if (error) {
            console.log(error)
            throw error;
        }
    res.send(result.rows);
    })
}

//post products
const createProduct = (req, res) => {
    const id = uuidv4();
    const {name, price, description, image} = req.body;
    
    pool.query(
        `INSERT INTO products (product_id, name, price, description, image)
        VALUES (
            $1, $2, $3, $4, $5
        ) RETURNING *;`, [id, name, price, description, image], (err, result) => {
            if (err) {
                console.log(err)
                throw err
            }
            res.status(200).json({
                message: 'product created',
                data: result.rows[0]
            })
        })
    
}

/*delete products*/
const deleteProduct = (req, res) => {
    const productId = req.params.id;
    pool.query(`DELETE FROM products WHERE product_id = $1`, [productId], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({
            message: 'product deleted'
        })
    })
}

/*update*/
const updateProducts = (req, res) => {
    const {name, price, description, image} = req.body
    const productId = req.params.id;
    pool.query(
        `UPDATE products SET name = $1, price = $2, description = $3, img_url = $4 WHERE product_id = $5;`, [name, price, description, image, productId], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({
            message: 'Product updated'
        })
    } )
}

module.exports = { getProducts, createProduct, deleteProduct, updateProducts, getOneProduct };
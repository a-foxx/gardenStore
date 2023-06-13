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

// {
//     totalCost: 160,
//     status: 'Confirmed',
//     cart_contents: [
//       {
//         cart_id: 'dbf939af-77bc-44e9-ad0e-eada51893732',
//         created: '2023-06-08T19:31:30.104+01:00',
//         product_id: '0b3fe546-aa22-45d3-9c68-99c0a97ea61e',
//         quantity: 4,
//         user_id: 'd7c2703a-2e50-4b5a-a9a8-620b0776f640',
//         g_profile_id: null,
//         name: 'Ash Sapling',
//         price: 15,
//         description: 'Ash sapling',
//         img_url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP._NVMe5EuyobbjlSKEhRg_wHaIj%26pid%3DApi&f=1&ipt=f26fe68f03341913818fd4fe0392bcb09135cd3f042c22ab0d4bab0cc20e3a3b&ipo=images'
//       },
//       {
//         cart_id: '2cd412d7-04a1-4cc9-8ec6-b2c535058a5e',
//         created: '2023-06-08T19:31:33.896+01:00',
//         product_id: 'c5c58c1a-6bf3-4cf3-a953-966f19b80412',
//         quantity: 2,
//         user_id: 'd7c2703a-2e50-4b5a-a9a8-620b0776f640',
//         g_profile_id: null,
//         name: 'Parasol',
//         price: 50,
//         description: 'Garden umbrella',
//         img_url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Vko5ePOOYmwnyPRC5rvR1wHaHZ%26pid%3DApi&f=1&ipt=eab858cac564f8378b51a5e2313622264d0384f32212e44eebcfef6b60a92561&ipo=images'
    //   }
//     ]
//   }
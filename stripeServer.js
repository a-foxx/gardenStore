const express = require("express");
const app = express();
const pool = require('./db')
// import { env } from 'node:process';

const { resolve } = require("path");
const router = require('express').Router();
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

router.use(express.static(process.env.REACT_APP_STATIC_DIR));

router.get("/payment", (req, res) => {
  const path = resolve(process.env.REACT_APP_STATIC_DIR + "/index.html");
  res.sendFile(path);
});

router.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  });
});

router.post("/create-payment-intent", async (req, res) => {
  const amounts = req.body.amount;
  // console.log(typeof req.body.amount)
  const data = { 
      currency: "EUR",
      amount: amounts,
      automatic_payment_methods: { enabled: true },
   }
  try {
    const paymentIntent = await stripe.paymentIntents.create(data);

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

// router.post("/create-payment-intent", async (req, res) => {
//   try {
//     // const amount = await getOrderTotal(); // Retrieve the amount from the database
//     const paymentIntent = await stripe.paymentIntents.create({
//       currency: "EUR",
//       amount: 10,
//       automatic_payment_methods: { enabled: true },
//     });

//     // Send publishable key and PaymentIntent details to client
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (e) {
//     return res.status(400).send({
//       error: {
//         message: e.message,
//       },
//     });
//   }
// });


// const getOrderTotal = () => {
//   const order_id = req.cookies.order_id;
//   try {
//     pool.query(`SELECT * FROM orders WHERE order_id = $1;`, [order_id], (err, result) => {
//       if (err) {
//         return res.status(500).json({
//           message: 'Cant locate order, please try again'
//         });
//       }
//       res.status(200).json({
//         data: result.rows[0].total
//       })
//       // Retrieve the 'total' value from the query result
//       const amount = result.rows; 
//       // const amount = result.rows[0].total; 
//       console.log('total: ', amount);
//     })
//   } catch (e) {
//     return res.status(500).json({
//       message: 'An error occurred while processing the request',
//     });
//   }
// }



module.exports = router;
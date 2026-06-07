const express = require("express");
const db = require("../config/db");
const router = express.Router();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET);

router.post("/create-order", async (req, res) => {

    try {

        console.log("CREATE ORDER API HIT");

        console.log("BODY:", req.body);

        const { amount } = req.body;

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        console.log("RAZORPAY ORDER:", order);

        res.status(200).json(order);

    } catch (error) {

        console.log("RAZORPAY ERROR:", error);

        res.status(500).json({
            success: false,
            error: error
        });
    }
});



router.post("/create", (req, res) => {

    console.log("PAYMENT API HIT");

    console.log("BODY:", req.body);

    const {
        customer_id,
        order_total,
        delivery_fee,
        final_total,
        payment_method,
        payment_status,
        order_status,
        razorpay_payment_id,
        razorpay_order_id
    } = req.body;

    const sql = `
        INSERT INTO payments (
            customer_id,
            order_total,
            delivery_fee,
            final_total,
            payment_method,
            payment_status,
            order_status,
            razorpay_payment_id,
            razorpay_order_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customer_id,
            order_total,
            delivery_fee,
            final_total,
            payment_method,
            payment_status,
            order_status,
            razorpay_payment_id,
            razorpay_order_id
        ],
        (error, result) => {

            if (error) {

                console.log("MYSQL ERROR:", error);

                return res.status(500).send({
                    success: false,
                    error: error,
                });
            }

            console.log("PAYMENT INSERTED");

            res.send({
                success: true,
                payment_id: result.insertId,
            });
        }
    );
});



router.get("/", (req, res) => {

    const sql = `

        SELECT * FROM payments
        ORDER BY payment_id DESC

    `;

    db.query(sql, (error, result) => {

        if (error) {

            console.log(error);

            return res.send({

                success: false,
                message: "Failed to Fetch Payments",

            });

        }

        res.send({

            success: true,
            data: result,

        });

    });

});


router.get("/:customer_id", (req, res) => {

    const customer_id = req.params.customer_id;

    const sql = `

        SELECT * FROM payments
        WHERE customer_id = ?
        ORDER BY payment_id DESC

    `;

    db.query(

        sql,

        [customer_id],

        (error, result) => {

            if (error) {

                console.log(error);

                return res.send({

                    success: false,
                    message: "Failed to Fetch Customer Payments",

                });

            }

            res.send({

                success: true,
                data: result,

            });

        }

    );

});

module.exports = router;
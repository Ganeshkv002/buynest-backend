const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/create", (req, res) => {

    const {

        customer_id,
        payment_id,
        products,

    } = req.body;

    if (!products || products.length === 0) {

        return res.send({

            success: false,
            message: "No products found",

        });
    }

    const values = products.map((item) => [

        customer_id,

        payment_id,

        item.product_id,

        item.name,

        item.image,

        item.quantity,

        item.price,

        item.price * item.quantity,

        "Processing",

    ]);

    const sql = `

        INSERT INTO orders (

            customer_id,
            payment_id,
            product_id,
            product_name,
            product_image,
            quantity,
            price,
            total_price,
            order_status

        )

        VALUES ?

    `;

    db.query(sql, [values], (error, result) => {

        if (error) {

            console.log(error);

            return res.send({

                success: false,
                message: "Order Failed",

            });
        }

        res.send({

            success: true,
            message: "Order Placed Successfully",

        });

    });

});





router.get("/:customer_id", (req, res) => {

    const customer_id = req.params.customer_id;

    const sql = `

        SELECT * FROM orders
        WHERE customer_id = ?

        ORDER BY order_id DESC

    `;

    db.query(

        sql,

        [customer_id],

        (error, result) => {

            if (error) {

                console.log(error);

                return res.send({

                    success: false,
                    message: "Failed to Fetch Orders",

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
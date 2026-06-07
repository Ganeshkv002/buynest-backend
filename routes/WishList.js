const express = require("express");

const router = express.Router();

const db = require("../config/db");



router.post("/add", (req, res) => {

    const { customer_id, product_id } = req.body;

    const sql =

        `INSERT INTO wishlist
    (customer_id,product_id)
    VALUES (?,?)`;

    db.query(

        sql,

        [
            customer_id,
            product_id
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false
                });

            }

            res.json({
                success: true
            });

        }

    );

});




router.delete("/remove", (req, res) => {

    const {
        customer_id,
        product_id
    } = req.body;

    const sql =

        `DELETE FROM wishlist
WHERE customer_id=?
AND product_id=?`;

    db.query(

        sql,

        [
            customer_id,
            product_id
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false
                });

            }

            res.json({
                success: true
            });

        }

    );

});




router.get("/:customer_id", (req, res) => {

    const customer_id =
        req.params.customer_id;

    const sql =

        `SELECT products.*
FROM wishlist
JOIN products
ON wishlist.product_id=
products.product_id
WHERE wishlist.customer_id=?`;

    db.query(

        sql,

        [customer_id],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false
                });

            }

            res.json({

                success: true,

                wishlist: result

            });

        }

    );

});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../config/db");


router.get("/cart/:customer_id", (req, res) => {

    const customer_id = req.params.customer_id;

    if (!customer_id) {

        return res.status(400).json({
            success: false,
            message: "customer_id is required"
        });
    }

    const sql = `
        SELECT 
            c.cart_id,
            c.customer_id,
            c.product_id,
            c.quantity,
            p.name,
            p.price,
            p.image,
            (c.quantity * p.price) AS total_price

        FROM cart c

        JOIN products p 
        ON c.product_id = p.product_id

        WHERE c.customer_id = ?
    `;

    db.query(sql, [customer_id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length === 0) {

            return res.json({
                success: true,
                message: "Cart is empty",
                grand_total: 0,
                data: []
            });
        }

       
        let grandTotal = 0;

        result.forEach((item) => {

            grandTotal += item.total_price;
        });

        return res.json({
            success: true,
            message: "Cart fetched successfully",
            grand_total: grandTotal,
            data: result
        });
    });
});


router.delete("/cart/delete/:cart_id", (req, res) => {

    const cart_id = req.params.cart_id;

    if (!cart_id) {

        return res.status(400).json({
            success: false,
            message: "cart_id is required"
        });
    }


    const checkSql = `
        SELECT * FROM cart
        WHERE cart_id = ?
    `;

    db.query(checkSql, [cart_id], (checkErr, checkResult) => {

        if (checkErr) {

            console.log(checkErr);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        

        if (checkResult.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

       

        const deleteSql = `
            DELETE FROM cart
            WHERE cart_id = ?
        `;

        db.query(deleteSql, [cart_id], (deleteErr, deleteResult) => {

            if (deleteErr) {

                console.log(deleteErr);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete cart item"
                });
            }

            return res.json({
                success: true,
                message: "Cart item deleted successfully"
            });
        });
    });
});

module.exports = router;
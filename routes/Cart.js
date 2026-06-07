const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/cart/:customer_id", (req, res) => {

    const customer_id = req.params.customer_id;
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
        JOIN products p ON c.product_id = p.product_id
        WHERE c.customer_id = ?
    `;

    db.query(sql, [customer_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send({
                success: false,
                message: "Database Error"
            });
        }

        res.send({
            success: true,
            data: result
        });

    });
});



/* =========================================
   UPDATE CART QUANTITY
========================================= */

router.put("/cart/update/:cart_id", (req, res) => {

    const cart_id = req.params.cart_id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.send({
            success: false,
            message: "Invalid quantity"
        });
    }

    const sql = `
        UPDATE cart
        SET quantity = ?
        WHERE cart_id = ?
    `;

    db.query(sql, [quantity, cart_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send({
                success: false,
                message: "Failed to update quantity"
            });
        }

        res.send({
            success: true,
            message: "Quantity updated"
        });

    });
});





router.delete("/cart/delete/:cart_id", (req, res) => {

    const cart_id = req.params.cart_id;

    const sql = `
        DELETE FROM cart
        WHERE cart_id = ?
    `;

    db.query(sql, [cart_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send({
                success: false,
                message: "Failed to delete item"
            });
        }

        res.send({
            success: true,
            message: "Item deleted successfully"
        });

    });
});




router.delete("/cart/clear/:customer_id", (req, res) => {

    const customer_id = req.params.customer_id;

    const sql = `
        DELETE FROM cart
        WHERE customer_id = ?
    `;

    db.query(sql, [customer_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send({
                success: false,
                message: "Failed to clear cart"
            });
        }

        res.send({
            success: true,
            message: "Cart cleared successfully"
        });

    });
});



module.exports = router;
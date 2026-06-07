const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/add-cart", (req, res) => {
    const { customer_id, product_id, quantity } = req.body;

 
    if (!customer_id || !product_id) {
        return res.status(400).json({
            success: false,
            message: "customer_id and product_id are required"
        });
    }

    const sql = `
        INSERT INTO cart (customer_id, product_id, quantity)
        VALUES (?, ?, ?)`;

    db.query(sql, [customer_id, product_id, quantity], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        return res.json({
            success: true,
            message: "Product added to cart successfully",
            cart_id: result.insertId
        });
    });
});

module.exports = router;
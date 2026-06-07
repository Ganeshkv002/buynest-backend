const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/products", (req, res) => {

    const category = req.query.category;
    let sql = "SELECT * FROM products";
    
    if (category && category !== "All") {
        sql += ` WHERE category='${category}'`;
    }

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.status(200).json({
            success: true,
            products: result
        });
    });
});

module.exports = router;
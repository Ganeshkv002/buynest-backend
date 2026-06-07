const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/login", (req, res) => {

    console.log("LOGIN API HIT");

    const { email_id, password } = req.body;

    if (!email_id || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });
    }

    const sql =
        `SELECT * FROM customers
         WHERE email_id = ?
         AND password = ?
         LIMIT 1`;

    db.query(sql, [email_id, password], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length > 0) {

            const user = result[0];

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    customer_id: user.customer_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email_id: user.email_id,
                    phone_num: user.phone_num,
                    address: user.address,
                    country: user.country
                }
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });

    });

});

module.exports = router;
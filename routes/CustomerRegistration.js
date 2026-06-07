const express = require("express");
const router = express.Router();
const db = require("../config/db");


router.post("/register", (req, res) => {

    const {
        first_name,
        last_name,
        gender,
        email_id,
        password,
        phone_num,
        address,
        country
    } = req.body;

    if (
        !first_name ||
        !last_name ||
        !gender ||
        !email_id ||
        !password ||
        !phone_num ||
        !address ||
        !country
    ) {

        return res.status(400).json({

            message: "All fields are required"

        });

    }

    const sql =

        `INSERT INTO customers
    (first_name,last_name,gender,email_id,password,phone_num,address,country)
    VALUES(?,?,?,?,?,?,?,?)`;

    db.query(sql,
        [
            first_name,
            last_name,
            gender,
            email_id,
            password,
            phone_num,
            address,
            country
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    message: "Registration failed"

                });

            }

            res.status(201).json({
                message: "Customer registered successfully",
                customerId: result.insertId
            });
        }

    );

});




router.put( "/update/:customer_id",

    (req, res) => {

        const customer_id =

            req.params.customer_id;

        const {

            first_name,
            last_name,
            email_id,
            phone_num,
            address

        } = req.body;

        const sql =`UPDATE customers SET first_name=?,last_name=?,email_id=?,phone_num=?,address=?WHERE customer_id=?`;
        db.query(sql,
            [
                first_name,
                last_name,
                email_id,
                phone_num,
                address,
                customer_id
            ],

            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Update failed"

                    });

                }

                res.json({

                    success: true,

                    message:
                        "Profile updated"

                });

            }

        );

    }

);

module.exports = router;
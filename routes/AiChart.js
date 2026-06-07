const express = require("express");
const router = express.Router();

require("dotenv").config();

const axios = require("axios");
const db = require("../config/db");


// =====================================================
// AI CHAT API
// =====================================================
router.post("/ai-chat", async (req, res) => {
  try {
    const { customer_id, message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    console.log("📩 USER MESSAGE:", message);

    // =========================================
    // SEARCH PRODUCTS
    // =========================================

    const searchSql = `
      SELECT *
      FROM products
      WHERE name LIKE ?
      LIMIT 5
    `;

    db.query(
      searchSql,
      [`%${message}%`],
      async (err, products) => {
        console.log("DB PRODUCTS:", products);
        if (err) {
          console.log(err);

          return res.status(500).json({
            success: false,
            message: "Database Error",
          });
        }

        let aiReply = "";

        // =========================================
        // PRODUCT FOUND
        // =========================================

        if (products.length > 0) {
          aiReply = `I found ${products.length} product(s) matching your search.`;
        } else {

          // =========================================
          // CALL GROQ AI
          // =========================================

          const aiResponse = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "user",
                  content: message,
                },
              ],
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              },
            }
          );

          aiReply =
            aiResponse.data.choices[0].message.content;
        }

        // =========================================
        // SAVE CHAT
        // =========================================

        const insertChatSql = `
          INSERT INTO chats
          (customer_id, user_message, ai_message)
          VALUES (?, ?, ?)
        `;

        db.query(
          insertChatSql,
          [
            customer_id || null,
            message,
            aiReply,
          ],
          (err, result) => {
            if (err) {
              console.log(err);

              return res.status(500).json({
                success: false,
                message: "Failed to save chat",
              });
            }

            const chatId = result.insertId;

            // =========================================
            // SAVE CHAT_PRODUCTS RELATION
            // =========================================

            if (products.length > 0) {
              console.log("DB PRODUCTS:", products);
              products.forEach((product) => {
                console.log("INSERTING:", chatId, product);
                db.query(
                  `
                  INSERT INTO chat_products
                  (chat_id, product_id)
                  VALUES (?, ?)
                  `,
                  [chatId, product.product_id],
                  (err) => {
                    if (err) {
                      console.log(
                        "chat_products insert error:",
                        err
                      );
                    }
                  }
                );

              });
            }

            // =========================================
            // CREATE IMAGE URL ARRAY
            // =========================================

            const images = products.map(
              (product) =>
                `https://1vrwdfdd-8000.inc1.devtunnels.ms/ProductImages/${product.image}`
            );

            // =========================================
            // RESPONSE
            // =========================================
            console.log(
  "FINAL PRODUCTS:",
  JSON.stringify(products, null, 2)
);
            res.json({
              success: true,
              reply: aiReply,
              images,
              products,
            });
          }
        );
      }
    );

  } catch (error) {
    console.log("AI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "AI Server Error",
    });
  }
});


// =====================================================
// GET PRODUCT DETAILS BY ID
// =====================================================
router.get("/product/:id", (req, res) => {

  const productId = req.params.id;

  db.query(
    `
    SELECT *
    FROM products
    WHERE id = ?
    `,
    [productId],
    (err, rows) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        product: rows[0],
      });
    }
  );
});

module.exports = router;
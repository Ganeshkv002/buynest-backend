const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ProductImages",express.static(path.join(__dirname, "ProductImages")));

// Routes
const customerRegisterRoutes = require("./routes/CustomerRegistration");
app.use("/api/customers", customerRegisterRoutes);

const customerLogin = require("./routes/CustomerLogin")
app.use("/api/customers",customerLogin)

const products = require("./routes/Products");
app.use("/api",products)

const cart = require("./routes/Cart");
app.use("/api", cart);

const addCartRoutes = require("./routes/AddToCart");
app.use("/api", addCartRoutes)

const deleteCart = require("./routes/DeleteCartItem");
app.use("/api", deleteCart)

const paymentRoute = require("./routes/Payment");
app.use("/api/payment", paymentRoute);

const orderRoutes = require("./routes/OrdersList");
app.use("/api/orders", orderRoutes);

const myOrders = require("./routes/MyOrders");
app.use("/api/orders", myOrders);

const wishlistRoutes = require("./routes/WishList")
app.use("/api/wishlist",wishlistRoutes);

const Aichat = require("./routes/Chat")
app.use("/api",Aichat)

const PORT = process.env.PORT || 5000;



app.get("/", (req, res) => {
    res.send("Server Running");
});

app.get("/test", (req, res) => {
    console.log("TEST ROUTE HIT");
    res.send("API is working");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

console.log("PORT =", PORT);
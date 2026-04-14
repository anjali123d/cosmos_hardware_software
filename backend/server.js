require("dotenv").config();
const express = require("express");
const connectDB = require('./config/db');
const cors = require("cors");

const app = express();

// connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/items", require("./routes/item.routes"));
app.use("/api/labs", require("./routes/lab.routes"));
app.use("/api/transactions", require("./routes/transaction.routes"));


// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
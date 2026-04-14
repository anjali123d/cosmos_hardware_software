
const express = require("express");
const router = express.Router();

const {
    issueItem,
    returnItem,
    getTransactions
} = require("../controllers/transaction.controller");

// Issue Item
router.post("/issue", issueItem);

// Return Item
router.post("/return", returnItem);

// Get All Transactions
router.get("/", getTransactions);

module.exports = router;
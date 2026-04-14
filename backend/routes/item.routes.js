const express = require("express");
const router = express.Router();

const {
    addItem,
    getItems
} = require("../controllers/item.controller");

// Add Item
router.post("/", addItem);

// Get All Items
router.get("/", getItems);

module.exports = router;
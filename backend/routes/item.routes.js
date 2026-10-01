
const express = require("express");
const router = express.Router();

const {
    addItem,
    getItems,
    updateItem
} = require("../controllers/item.controller");


// Add Item
router.post("/", addItem);


// Get All Items
router.get("/", getItems);


// Update Item Quantity
router.put("/:id", updateItem);


module.exports = router;


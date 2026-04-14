
const Item = require("../models/item.model");

// Add Item
exports.addItem = async (req, res) => {
    try {
        const { name, quantity, description } = req.body;

        const item = await Item.create({ name, quantity, description });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
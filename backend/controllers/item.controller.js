
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
exports.updateItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (quantity === undefined || quantity === null) { return res.status(400).json({ message: "Quantity is required" }); } if (isNaN(quantity) || Number(quantity) < 0) { return res.status(400).json({ message: "Quantity must be a valid number greater than or equal to 0" }); } const item = await Item.findByIdAndUpdate(req.params.id, { quantity: Number(quantity) }, { new: true, runValidators: true });
        if (!item) { return res.status(404).json({ message: "Item not found" }); } res.json({ message: "Item quantity updated successfully", item });
    } catch (error) { res.status(500).json({ message: error.message }); }
};
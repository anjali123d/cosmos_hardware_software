const Item = require("../models/item.model");
const Transaction = require("../models/transaction.model");


// ✅ ISSUE ITEM (Decrease Stock)
exports.issueItem = async (req, res) => {
    try {
        const { itemId, labId, quantity } = req.body;

        const item = await Item.findById(itemId);

        if (!item) return res.status(404).json({ message: "Item not found" });

        if (item.quantity < quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        // decrease stock
        item.quantity -= quantity;
        await item.save();

        // create transaction
        const transaction = await Transaction.create({
            item: itemId,
            lab: labId,
            quantity,
            type: "issue"
        });

        res.status(200).json(transaction);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ RETURN ITEM (Increase Stock)
exports.returnItem = async (req, res) => {
    try {
        const { itemId, labId, quantity } = req.body;

        const item = await Item.findById(itemId);

        if (!item) return res.status(404).json({ message: "Item not found" });

        // increase stock
        item.quantity += quantity;
        await item.save();

        const transaction = await Transaction.create({
            item: itemId,
            lab: labId,
            quantity,
            type: "return"
        });

        res.status(200).json(transaction);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 📜 Get All Transactions
exports.getTransactions = async (req, res) => {
    try {
        const data = await Transaction.find()
            .populate("item", "name")
            .populate("lab", "name");

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
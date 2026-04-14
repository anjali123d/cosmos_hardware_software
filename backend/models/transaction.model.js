
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lab",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["issue", "return"],
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
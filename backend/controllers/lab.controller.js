const Lab = require("../models/lab.model");

// Add Lab
exports.addLab = async (req, res) => {
    try {
        const { name, location } = req.body;

        const lab = await Lab.create({ name, location });

        res.status(201).json(lab);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Labs
exports.getLabs = async (req, res) => {
    try {
        const labs = await Lab.find();
        res.json(labs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
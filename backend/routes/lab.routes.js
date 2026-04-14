const express = require("express");
const router = express.Router();

const {
    addLab,
    getLabs
} = require("../controllers/lab.controller");

// Add Lab
router.post("/", addLab);

// Get Labs
router.get("/", getLabs);

module.exports = router;
const express = require("express");

const router = express.Router();

const conversionController =
    require("../controllers/conversionController");

const {
    requireLogin
} = require("../middleware/authMiddleware");

// CREATE CONVERSION
router.post(
    "/conversions",
    conversionController.createConversion
);

// GET HISTORY
router.get(
    "/history",
    requireLogin,
    conversionController.getHistory
);

module.exports = router;
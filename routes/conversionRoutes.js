const express = require("express");

const router = express.Router();

const conversionController =
    require("../controllers/conversionController");

const {
    requireLogin
} = require("../middleware/authMiddleware");

// CREATE CONVERSION
router.post( "/conversions",conversionController.createConversion);

// GET HISTORY
router.get("/history", requireLogin, conversionController.getHistory);
// ADMIN SEARCH HISTORY BY USERNAME
router.get( "/history/search/:username",requireLogin,conversionController.searchHistory);

module.exports = router;
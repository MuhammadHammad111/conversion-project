const express = require("express");

const router = express.Router();

const adminController =
    require("../controllers/adminController");

const {
    requireAdmin
} = require("../middleware/authMiddleware");

// GET ALL USERS
router.get(
    "/users",
    requireAdmin,
    adminController.getUsers
);

// GET ALL HISTORY
router.get(
    "/admin/history",
    requireAdmin,
    adminController.getAllHistory
);

module.exports = router;
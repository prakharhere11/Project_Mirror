const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
} = require("../controllers/profileController");

// All profile routes require authentication
router.use(protect);

// GET /api/profile
router.get("/", getProfile);

// PUT /api/profile
router.put("/", updateProfile);

module.exports = router;
const express = require("express");

const router = express.Router();

const {
    register,
    login,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Route
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        },
    });
});

module.exports = router;
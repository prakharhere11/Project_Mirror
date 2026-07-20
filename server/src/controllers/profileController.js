const User = require("../models/User");

// @desc    Get Logged-in User Profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                createdAt: req.user.createdAt,
            },
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

// @desc    Update Logged-in User Profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        let { name, email } = req.body;

        // Require at least one field
        if (name === undefined && email === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name or email is required",
            });
        }

        const user = req.user;

        // ---------------- Name ----------------
        if (name !== undefined) {

            if (typeof name !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Name must be a string",
                });
            }

            name = name.trim();

            if (name.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty",
                });
            }
            if (/^\d+$/.test(name)) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot contain only numbers",
                });
            }
           

            user.name = name;
        }

        // ---------------- Email ----------------
        if (email !== undefined) {

            if (typeof email !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Email must be a string",
                });
            }

            email = email.trim().toLowerCase();

            if (email.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Email cannot be empty",
                });
            }

            if (email !== user.email) {

                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    return res.status(409).json({
                        success: false,
                        message: "Email already in use",
                    });
                }

                user.email = email;
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {

    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Email already in use",
        });
    }

    if (error.name === "ValidationError") {

        const firstError = Object.values(error.errors)[0].message;

        return res.status(400).json({
            success: false,
            message: firstError,
        });
    }

    console.error(error);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });

}};

module.exports = {
    getProfile,
    updateProfile,
};
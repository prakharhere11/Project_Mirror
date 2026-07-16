const JournalEntry = require("../models/JournalEntry");
const calculateStreak = require("../utils/calculateStreak");

// @desc    Get Dashboard Summary
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const [totalEntries, recentEntries, entriesForStreak] = await Promise.all([
            JournalEntry.countDocuments({ userId }),

            JournalEntry.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select("content createdAt reflection.status"),

            JournalEntry.find({ userId })
                .select("createdAt"),
        ]);

        const currentStreak = calculateStreak(entriesForStreak);

        return res.status(200).json({
            success: true,
            totalEntries,
            currentStreak,
            recentEntries,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    getDashboardSummary,
};
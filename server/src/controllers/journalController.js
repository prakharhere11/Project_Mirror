const { generateReflection } = require("../services/aiService");
const JournalEntry = require("../models/JournalEntry");

// @desc    Create Journal Entry
// @route   POST /api/journals
// @access  Private

const createEntry = async (req, res) => {
    try {
        let { content } = req.body;

        // Validate input
        if (typeof content !== "string") {
            return res.status(400).json({
                success: false,
                message: "Journal content is required",
            });
        }

        content = content.trim();

        if (content.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Journal content cannot be empty",
            });
        }

        // Step 1: Save journal entry
        const entry = await JournalEntry.create({
            userId: req.user._id,
            content,
        });

        // Step 2: Respond immediately
        res.status(201).json({
            success: true,
            message: "Journal created successfully",
            entry,
        });

        // Step 3: Generate AI reflection in background
        generateReflection(content)
            .then(async (reflection) => {

                await JournalEntry.findByIdAndUpdate(entry._id, {
                    reflection: {
                        status: "ready",
                        summary: reflection.summary,
                        emotions: reflection.emotions,
                        reflectionQuestions: reflection.reflectionQuestions,
                        positiveObservation: reflection.positiveObservation,
                        suggestion: reflection.suggestion,
                        generatedAt: new Date(),
                    },
                });

                console.log(`Reflection generated for journal ${entry._id}`);

            })
            .catch(async (err) => {

                console.error(
                    `Reflection generation failed for journal ${entry._id}:`,
                    err.message
                );

                await JournalEntry.findByIdAndUpdate(entry._id, {
                    "reflection.status": "failed",
                });

            });

    } catch (error) {

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
    }
};

// @desc    Get All Journal Entries
// @route   GET /api/journals
// @access  Private
const getEntries = async (req, res) => {
    try {

        const entries = await JournalEntry.find({
            userId: req.user._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: entries.length,
            entries,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// @desc    Get Single Journal Entry
// @route   GET /api/journals/:id
// @access  Private
const getEntryById = async (req, res) => {
    try {

        const entry = await JournalEntry.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Journal entry not found",
            });
        }

        return res.status(200).json({
            success: true,
            entry,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// @desc    Update Journal Entry
// @route   PUT /api/journals/:id
// @access  Private
const updateEntry = async (req, res) => {
    try {

        let { content } = req.body;

        // Reject empty request body
        if (content === undefined) {
            return res.status(400).json({
                success: false,
                message: "Journal content is required",
            });
        }

        // Reject non-string values
        if (typeof content !== "string") {
            return res.status(400).json({
                success: false,
                message: "Journal content must be a string",
            });
        }

        content = content.trim();

        if (content.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Journal content cannot be empty",
            });
        }

        const entry = await JournalEntry.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Journal entry not found",
            });
        }

        entry.content = content;

        // Reset AI reflection after content update
        entry.reflection = {
            status: "pending",
            summary: "",
            emotions: [],
            reflectionQuestions: [],
            positiveObservation: "",
            suggestion: "",
            generatedAt: null,
        };

        await entry.save();

        return res.status(200).json({
            success: true,
            message: "Journal updated successfully",
            entry,
        });

    } catch (error) {

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
    }
};

// @desc    Retry AI Reflection
// @route   POST /api/journals/:id/reflect
// @access  Private
const retryReflection = async (req, res) => {
    try {

        const entry = await JournalEntry.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Journal entry not found",
            });
        }

        // Already generated
        if (entry.reflection.status === "ready") {
            return res.status(400).json({
                success: false,
                message: "Reflection already exists.",
            });
        }

        // Mark as pending
        entry.reflection.status = "pending";
        await entry.save();

        try {

            const reflection = await generateReflection(entry.content);

            entry.reflection = {
                status: "ready",
                summary: reflection.summary,
                emotions: reflection.emotions,
                reflectionQuestions: reflection.reflectionQuestions,
                positiveObservation: reflection.positiveObservation,
                suggestion: reflection.suggestion,
                generatedAt: new Date(),
            };

            await entry.save();

            return res.status(200).json({
                success: true,
                message: "Reflection generated successfully.",
                entry,
            });

        } catch (aiError) {

            entry.reflection.status = "failed";
            await entry.save();

            return res.status(502).json({
                success: false,
                message: aiError.message,
            });

        }

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

// @desc    Delete Journal Entry
// @route   DELETE /api/journals/:id
// @access  Private
const deleteEntry = async (req, res) => {
    try {

        const entry = await JournalEntry.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Journal entry not found",
            });
        }

        await entry.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Journal deleted successfully",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// @desc    Search Journal Entries
// @route   GET /api/journals/search?q=<term>
// @access  Private
const getSearchResults = async (req, res) => {
    try {

        let { q } = req.query;

        if (typeof q !== "string") {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        q = q.trim();

        if (q.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Search query cannot be empty",
            });
        }

        if (q.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Search query must be at least 2 characters",
            });
        }

        const entries = await JournalEntry.find(
            {
                userId: req.user._id,
                $text: {
                    $search: q,
                },
            },
            {
                score: {
                    $meta: "textScore",
                },
            }
        )
            .sort({
                score: {
                    $meta: "textScore",
                },
            })
            .select("content createdAt reflection.status");

        return res.status(200).json({
            success: true,
            count: entries.length,
            entries,
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
    createEntry,
    getEntries,
    getEntryById,
    updateEntry,
    deleteEntry,
    retryReflection,
    getSearchResults,
};
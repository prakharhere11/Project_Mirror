const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        content: {
            type: String,
            required: [true, "Journal content is required"],
            trim: true,
            minlength: [10, "Journal must be at least 10 characters long"],
            maxlength: [10000, "Journal cannot exceed 10000 characters"],
        },

        reflection: {
            status: {
                type: String,
                enum: ["pending", "ready", "failed"],
                default: "pending",
            },

            summary: {
                type: String,
                default: "",
            },

            emotions: {
                type: [String],
                default: [],
            },

            reflectionQuestions: {
                type: [String],
                default: [],
            },

            positiveObservation: {
                type: String,
                default: "",
            },

            suggestion: {
                type: String,
                default: "",
            },

            generatedAt: {
                type: Date,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
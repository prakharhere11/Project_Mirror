const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
    createEntry,
    getEntries,
    getEntryById,
    updateEntry,
    retryReflection,
    deleteEntry,
    getSearchResults
} = require("../controllers/journalController");

router.use(protect); // every route below requires authentication


router.get("/search",getSearchResults);

router.post("/", createEntry);
router.get("/", getEntries);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);
router.get("/:id", getEntryById);

router.post("/:id/reflect", retryReflection);

module.exports = router;
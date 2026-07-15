const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require("../controllers/journalController");

router.use(protect); // every route below requires authentication

router.post("/", createEntry);
router.get("/", getEntries);
router.get("/:id", getEntryById);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

module.exports = router;
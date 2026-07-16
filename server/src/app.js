const express = require("express");
const cors = require("cors");
const journalRoutes = require("./routes/journalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Atlas API is running",
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/dashboard", dashboardRoutes);


module.exports = app;
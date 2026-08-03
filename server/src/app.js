const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ success: true, message: "Atlas API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);

module.exports = app;
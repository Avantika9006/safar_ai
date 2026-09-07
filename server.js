require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const chatRoutes = require("./routes/chatRoutes");

// Serve frontend files
app.use(express.static(path.join(__dirname)));

// AI Chat API
app.use("/api/chat", chatRoutes);

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SAFAR AI server is running on port ${PORT}`);
});
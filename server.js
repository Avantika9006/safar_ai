require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const chatRoutes = require("./routes/chatRoutes");
const crowdRoutes = require("./routes/crowdRoutes");

// Serve frontend files
app.use(express.static(path.join(__dirname)));

// AI Chat API
app.use("/api/chat", chatRoutes);
app.use("/api/crowd", crowdRoutes);

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.get("/api/crowd", async (req, res) => {
    try {
        const { venue, city } = req.query;

        if (!venue || !city) {
            return res.status(400).json({
                error: "venue and city are required"
            });
        }

        const apiKey = process.env.BESTTIME_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "BESTTIME_API_KEY is not configured"
            });
        }

        // BestTime API request will go here
        res.json({
            message: "Crowd route is working",
            venue,
            city
        });

    } catch (error) {
        console.error("Crowd API error:", error);

        res.status(500).json({
            error: "Unable to fetch crowd data"
        });
    }
});

app.listen(PORT, () => {
    console.log(`SAFAR AI server is running on port ${PORT}`);
});
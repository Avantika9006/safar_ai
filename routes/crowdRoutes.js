const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { venue } = req.query;

        if (!venue) {
            return res.status(400).json({
                error: "Venue name is required"
            });
        }

        const apiKey = process.env.BESTTIME_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "BestTime API key is missing"
            });
        }

        const url =
            `https://besttime.app/api/v1/forecasts` +
            `?api_key=${encodeURIComponent(apiKey)}` +
            `&venue_name=${encodeURIComponent(venue)}`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            console.error("BestTime error:", data);

            return res.status(response.status).json({
                error: "BestTime API request failed",
                details: data
            });
        }

        res.json(data);

    } catch (error) {
        console.error("Crowd API error:", error);

        res.status(500).json({
            error: "Unable to get crowd information"
        });
    }
});

module.exports = router;
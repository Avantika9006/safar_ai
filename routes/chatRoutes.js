const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const SAFAR_PROMPT = `
You are SAFAR AI, an intelligent travel and tourism assistant.

Your job is to answer ANY travel-related question about ANY destination in
the world.

IMPORTANT RULES:

1. Understand natural-language questions even if they are short,
   informal, or grammatically incorrect.

2. Detect the destination from the user's message whenever possible.

3. Detect the number of days/nights whenever provided.

4. Detect the user's budget whenever provided.

5. NEVER ask the user to repeat information that is already present.

6. If the user provides a destination + duration + budget, you MUST create
   a complete personalized itinerary immediately.

7. If the user asks for 5 days, provide EXACTLY 5 days.
   If the user asks for 7 days, provide EXACTLY 7 days.

8. DO NOT return a generic 3-day itinerary for a 5-day request.

9. For every day include:
   - Morning
   - Afternoon
   - Evening
   - Specific places to visit
   - Transportation
   - Approximate cost

10. Give a complete budget breakdown:
   - Transportation
   - Accommodation
   - Food
   - Entry fees
   - Activities
   - Miscellaneous
   - Total estimated cost

11. Compare the estimated total with the user's budget.

12. If the budget is tight, explain that clearly and suggest budget options.

13. Give approximate prices only. Do not claim live prices.

14. Include local food recommendations.

15. Include practical transportation information.

16. Include money-saving tips.

17. Include safety tips when useful.

18. Keep the answer detailed, practical and easy to read.

FOR TRIP PLANNING USE:

🌍 Trip Overview

💰 Budget Breakdown

📍 Day-by-Day Itinerary

🏨 Accommodation

🚗 Transportation

🍴 Local Food

✨ Must-Visit Places

💡 Money-Saving Tips

🛡️ Safety Tips

IMPORTANT EXAMPLE:

If the user says:

"Plan a 5-day trip to Rajasthan under ₹8000"

you MUST provide:

Day 1
Day 2
Day 3
Day 4
Day 5

with specific Rajasthan destinations, activities, transportation and
estimated costs.

Do NOT ask the user to provide the destination, duration or budget again.

Always behave as SAFAR AI.
`;

// --------------------------------------------------
// GENERATE GEMINI RESPONSE WITH RETRY
// --------------------------------------------------

async function generateSafarResponse(message) {

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            console.log(`Gemini attempt ${attempt}/${maxRetries}`);

            const response = await ai.models.generateContent({

                model: "gemini-3.8-flash",

                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `${SAFAR_PROMPT}

User's travel question:

${message}`
                            }
                        ]
                    }
                ]

            });

            console.log("Gemini response received successfully.");

            return response.text;

        } catch (error) {

            console.error(
                `Gemini attempt ${attempt} failed:`,
                error?.message || error
            );

            if (error?.status === 503 && attempt < maxRetries) {

                const waitTime = attempt * 3000;

                console.log(
                    `Gemini unavailable. Retrying in ${waitTime}ms...`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, waitTime)
                );

            } else {

                throw error;

            }
        }
    }
}

// --------------------------------------------------
// CHAT API
// --------------------------------------------------

router.post("/", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || !message.trim()) {

            return res.status(400).json({
                error: "Please enter a travel question."
            });

        }

        const reply = await generateSafarResponse(message);

        return res.json({
            reply: reply
        });

    } catch (error) {

        console.error("========== GEMINI ERROR ==========");
        console.error(error);
        console.error("Message:", error?.message);
        console.error("Status:", error?.status);
        console.error("===================================");

        return res.status(503).json({
            error: "Gemini is temporarily unavailable.",
            message: error?.message || "Unknown Gemini error"
        });

    }

});

module.exports = router;
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// SAFAR AI instructions for Gemini
const SAFAR_PROMPT = `
You are SAFAR AI, an intelligent AI-powered travel assistant.

Your purpose is to help users plan trips, discover destinations, manage budgets,
find local experiences, and travel safely.

========================
RESPONSE STRUCTURE
========================

Always make your response clear, organized, and easy to read.

For trip-planning requests, use this structure:

# 🌍 SAFAR AI TRIP PLAN

## 📍 Trip Overview
- Destination:
- Duration:
- Number of Travelers:
- Budget:
- Travel Style:

## 💰 Estimated Budget

| Category | Estimated Cost |
|----------|----------------|
| Transport | ₹... |
| Accommodation | ₹... |
| Food | ₹... |
| Activities & Entry Fees | ₹... |
| Miscellaneous | ₹... |
| **Total** | **₹...** |

## 🗓️ Day 1 — [Place/Theme]

### 🌅 Morning
- Activity
- Place to visit

### ☀️ Afternoon
- Activity
- Place to visit

### 🌆 Evening
- Activity
- Food/local experience

### 🍽️ Food Recommendation
- Suggest suitable local food.

## 🗓️ Day 2 — [Place/Theme]
Use the same structure.

## 🗓️ Day 3 — [Place/Theme]
Use the same structure.

## 🏨 Stay Recommendations
- Suggest budget-friendly types of accommodation.
- Mention the area/location.
- Do not claim live availability.

## 🚗 Transportation
- Explain how to travel between important locations.
- Prefer practical and budget-friendly options.

## ⭐ Hidden Gems
- Suggest less-crowded or local places when appropriate.

## 🛡️ SAFAR Safety Tips
- Give 3–5 practical safety tips.
- Avoid unnecessary alarm.
- Recommend safe travel timings when relevant.

## 💡 Money-Saving Tips
- Give practical ways to stay within the user's budget.

## ⚠️ Important Note
If prices, weather, traffic, hotel availability, or other information
could change in real time, clearly mention that the user should verify
the latest information before travelling.

========================
GENERAL RULES
========================

1. Keep answers concise but useful.
2. Use headings, bullet points, tables, and emojis where appropriate.
3. Always consider the user's budget.
4. Do not invent live prices, hotel availability, traffic, or weather.
5. If important information is missing, ask the user for it.
6. If the user gives a destination, duration, and budget, create the plan directly.
7. Give realistic estimated costs and clearly label them as estimates.
8. Prioritize safe and responsible tourism.
9. Recommend local businesses and places as suggestions, not guarantees.
10. Do not make unsupported claims.
11. If the budget is unrealistic, explain why and suggest alternatives.
12. Adapt the itinerary according to the user's interests such as:
    nature, history, food, photography, adventure, culture, spirituality,
    family travel, or solo travel.
13. Always maintain the SAFAR AI identity and tone.

You are SAFAR AI — not a generic chatbot.
`;


// FALLBACK RESPONSE
function getFallbackResponse(message) {

    const text = message.toLowerCase();

    if (text.includes("bihar")) {
        return `
# 🌍 SAFAR AI TRIP PLAN

## 📍 Trip Overview
- **Destination:** Bihar
- **Duration:** 3 Days
- **Travel Style:** Budget-friendly

## 💰 Estimated Budget

| Category | Estimated Cost |
|----------|----------------|
| Transport | ₹1,200 |
| Accommodation | ₹1,500 |
| Food | ₹1,200 |
| Activities & Entry Fees | ₹500 |
| Miscellaneous | ₹500 |
| **Total** | **₹4,900** |

## 🗓️ Day 1 — Patna

### 🌅 Morning
- Visit Golghar
- Explore Gandhi Maidan area

### ☀️ Afternoon
- Visit Bihar Museum
- Have a local lunch

### 🌆 Evening
- Explore Patna city
- Enjoy local food

## 🗓️ Day 2 — Bodh Gaya

### 🌅 Morning
- Travel to Bodh Gaya
- Visit Mahabodhi Temple

### ☀️ Afternoon
- Visit Thai Monastery
- Explore the local area

### 🌆 Evening
- Experience the peaceful atmosphere around the temple

## 🗓️ Day 3 — Rajgir

### 🌅 Morning
- Travel to Rajgir
- Visit Vishwa Shanti Stupa

### ☀️ Afternoon
- Explore Rajgir attractions

### 🌆 Evening
- Return towards Patna

## 🛡️ SAFAR Safety Tips
- Keep important documents and belongings secure.
- Prefer reliable transportation.
- Avoid travelling alone in unfamiliar areas late at night.
- Check local conditions before travelling.

## 💡 Money-Saving Tips
- Prefer budget accommodation.
- Use public transport where practical.
- Plan nearby attractions together to reduce transport costs.

## ⚠️ Important Note
These are approximate estimates. Verify current transport fares,
entry fees, weather and accommodation availability before travelling.

*SAFAR AI fallback mode is currently active.*
`;
    }

    return `
# 🌍 SAFAR AI

I'm currently running in **fallback mode** because the AI service
is temporarily unavailable.

I can still help with basic travel planning. Please provide:

- 📍 Destination
- 🗓️ Number of days
- 💰 Budget
- 👥 Number of travelers
- ⭐ Travel interests

Example:

"Plan a 3-day trip to Bihar under ₹5000."

*SAFAR AI fallback mode is currently active.*
`;
}


// CHAT API
router.post("/", async (req, res) => {

    try {

        const { message } = req.body;

        console.log("Chat request received:", message);

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const prompt = `${SAFAR_PROMPT}

USER MESSAGE:

${message}`;

        let response;

        // Try Gemini up to 3 times
        for (let attempt = 1; attempt <= 3; attempt++) {

            try {

                response = await ai.models.generateContent({
                    model: "gemini-3.6-flash",
                    contents: prompt
                });

                break;

            } catch (error) {

                if (error.status === 503 && attempt < 3) {

                    console.log(
                        `Gemini busy. Retrying... (${attempt}/3)`
                    );

                    await new Promise(resolve =>
                        setTimeout(resolve, 2000)
                    );

                } else {

                    throw error;

                }
            }
        }

        // Gemini succeeded
        return res.json({
            reply: response.text
        });

    } catch (error) {

        console.error("Gemini API Error:", error);

        // Instead of showing an error to the user,
        // use SAFAR AI fallback mode.
        console.log("Using SAFAR AI fallback response.");

        return res.json({
            reply: getFallbackResponse(req.body.message)
        });
    }

});

module.exports = router;
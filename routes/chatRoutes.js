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

    const text = message.trim();

    let destination = "your destination";

    const patterns = [
        /trip to (.+?)(?:\s+under|\s+for|\s+with|\s+on|$)/i,
        /travel to (.+?)(?:\s+under|\s+for|\s+with|\s+on|$)/i,
        /visit (.+?)(?:\s+under|\s+for|\s+with|\s+on|$)/i,
        /trip in (.+?)(?:\s+under|\s+for|\s+with|\s+on|$)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);

        if (match && match[1]) {
            destination = match[1].trim();
            break;
        }
    }

    let duration = "3 days";

    const durationMatch = text.match(
        /(\d+)\s*(?:day|days|night|nights)/i
    );

    if (durationMatch) {
        duration = `${durationMatch[1]} days`;
    }

    let budget = "Not specified";

    const budgetMatch = text.match(
        /(?:₹|rs\.?|inr)\s*([\d,]+)|(?:under|budget of)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
    );

    if (budgetMatch) {
        const amount = budgetMatch[1] || budgetMatch[2];
        budget = `₹${amount}`;
    }

    return `
# 🌍 SAFAR AI TRIP PLAN

## 📍 Trip Overview

- **Destination:** ${destination}
- **Duration:** ${duration}
- **Budget:** ${budget}
- **Travel Style:** Budget-friendly

## 💰 Estimated Budget

| Category | Estimated Cost |
|----------|----------------|
| Transport | ₹1,500 |
| Accommodation | ₹2,000 |
| Food | ₹1,500 |
| Activities & Entry Fees | ₹700 |
| Miscellaneous | ₹500 |
| **Total** | **₹6,200 approx.** |

## 🗓️ Day 1 — Explore ${destination}

### 🌅 Morning
- Explore the main attractions of ${destination}.
- Visit a popular landmark or sightseeing location.

### ☀️ Afternoon
- Explore nearby attractions.
- Experience local cuisine.

### 🌆 Evening
- Explore a local market or popular evening spot.

## 🗓️ Day 2 — Local Experiences

### 🌅 Morning
- Visit another important attraction around ${destination}.
- Explore the local culture and surroundings.

### ☀️ Afternoon
- Try a local activity or visit a historical/natural attraction.

### 🌆 Evening
- Visit a scenic or popular evening location.

## 🗓️ Day 3 — Hidden Gems & Relaxation

### 🌅 Morning
- Explore a less-crowded location near ${destination}.
- Take photographs and enjoy the surroundings.

### ☀️ Afternoon
- Try another local experience.
- Have a relaxed lunch.

### 🌆 Evening
- Visit a local market for souvenirs.
- Prepare for your return journey.

## 🏨 Stay Recommendations

- Choose budget hotels, hostels, or homestays.
- Prefer accommodation close to major attractions or public transport.
- Verify current prices and availability before booking.

## 🚗 Transportation

- Use public transportation wherever practical.
- For nearby attractions, consider shared/local transport.
- Compare transportation options before travelling.

## ⭐ Hidden Gems

- Explore local markets.
- Ask locals about less-crowded attractions.
- Look for local food and cultural experiences.

## 🛡️ SAFAR Safety Tips

- Keep your belongings and important documents secure.
- Prefer reliable transportation.
- Check local weather and travel conditions.
- Avoid unfamiliar areas late at night.
- Keep emergency contacts accessible.

## 💡 Money-Saving Tips

- Prefer budget accommodation.
- Use public transportation where practical.
- Eat at local restaurants.
- Group nearby attractions together to reduce transportation costs.

## ⚠️ Important Note

This is SAFAR AI's fallback travel plan because the AI service
is temporarily unavailable.

Prices, weather, transportation, entry fees and accommodation
availability can change. Verify the latest information before travelling.

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
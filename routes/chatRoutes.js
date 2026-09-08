const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const SAFAR_PROMPT = `
You are SAFAR AI, an intelligent travel and tourism assistant.

Your job is to answer ANY travel-related question about ANY destination in the world.

The user may ask about:
- places to visit
- trip planning
- sightseeing
- food
- hotels/stays
- transportation
- routes
- activities
- hidden gems
- local culture
- estimated budget
- safety
- best time to visit
- family trips
- solo trips
- student/budget trips
- itinerary planning
- general information about a destination

IMPORTANT:
1. Understand natural-language questions even if they are short or grammatically incorrect.
2. Detect the destination from the user's message whenever possible.
3. Do NOT require the user to use phrases like "trip to".
4. If the user asks about a city, state, country, tourist place, or region, answer specifically about that location.
5. Never respond with generic "your destination" when the destination can be understood.
6. Give practical and useful information.
7. Do not invent live information such as current hotel prices, weather, flight availability, or opening hours.
8. For prices, give approximate ranges and clearly label them as estimates.
9. Adapt the answer to the user's budget, duration and interests when provided.
10. If important information is missing, still give a useful answer.
11. Keep the response well structured and easy to read.
12. For itineraries, include realistic travel flow between places.
13. Mention local food and activities where relevant.
14. Include safety tips when appropriate.
15. Do not overwhelm the user with unnecessary information.

For a trip-planning request, use this structure when appropriate:

🌍 Trip Overview
💰 Estimated Budget
📍 Day-by-Day Itinerary
🏨 Stay
🚗 Transportation
🍴 Local Food
✨ Things to Do
💎 Hidden Gems
🛡️ Safety Tips
💡 Money-Saving Tips

Always behave as SAFAR AI.
`;


// --------------------------------------------------
// UNIVERSAL FALLBACK
// --------------------------------------------------

function getFallbackResponse(message) {

    const text = String(message || "").trim();
    const lowerText = text.toLowerCase();

    // Greeting
    if (
        lowerText === "hello" ||
        lowerText === "hi" ||
        lowerText === "hey" ||
        lowerText === "hii" ||
        lowerText.includes("hello safar") ||
        lowerText.includes("hi safar")
    ) {
        return `
🌍 **Hello! I'm SAFAR AI** 👋

I'm your AI travel assistant and traveller's companion.

I can help you with:

📍 Places to visit  
🗺️ Trip planning & itineraries  
💰 Budget-friendly travel  
🍴 Local food & experiences  
🚗 Transportation & routes  
🏞️ Activities & hidden gems  
🛡️ Travel tips & safety  

Just tell me where you want to go or what you want to know!

**For example:**
"Plan a 5-day trip to Rajasthan under ₹8000."
`;
    }

    // If user asks something that is not a travel question
    if (
        lowerText === "thanks" ||
        lowerText === "thank you" ||
        lowerText === "ok" ||
        lowerText === "okay"
    ) {
        return `
🌍 **SAFAR AI**

You're welcome! 😊

Whenever you're ready, tell me a destination or travel question and I'll help you plan your journey.
`;
    }

    // Try to detect destination
    let destination = null;

    const patterns = [
        /(?:trip|travel|visit|explore|exploring|places|things|food|hotels?|guide|about)\s+(?:to|in|about)?\s*([A-Za-z][A-Za-z .'-]{2,})/i,
        /(?:in|to)\s+([A-Za-z][A-Za-z .'-]{2,})/i,
        /(?:about|for|of)\s+([A-Za-z][A-Za-z .'-]{2,})/i
    ];

    for (const pattern of patterns) {

        const match = text.match(pattern);

        if (match && match[1]) {

            destination = match[1]
                .replace(/\b(under|for|with|on|during|within)\b.*$/i, "")
                .trim();

            if (destination.length > 2) {
                break;
            }
        }
    }

    if (destination) {
        destination = destination
            .replace(/^(a|an|the|my|me)\s+/i, "")
            .trim();
    }

    if (!destination) {
        destination = "this destination";
    }

    // Duration
    const durationMatch = text.match(
        /(\d+)\s*(?:day|days|night|nights)/i
    );

    const duration = durationMatch
        ? `${durationMatch[1]} days`
        : "a short trip";

    // Budget
    const budgetMatch = text.match(
        /(?:₹|rs\.?|inr)\s*([\d,]+)/i
    );

    const budget = budgetMatch
        ? `₹${budgetMatch[1]}`
        : "a budget suitable for you";

    return `
🌍 **SAFAR AI – Travel Guide**

I can help you explore **${destination}**.

### 📍 What you can explore

• Popular tourist attractions  
• Historical and cultural places  
• Nature and scenic locations  
• Local markets  
• Famous food and local cuisine  
• Adventure and recreational activities  

### 🗓️ Suggested ${duration} plan

**Day 1 – Explore the city**

• Visit major attractions  
• Explore a local market  
• Try regional food  

**Day 2 – Culture & Experiences**

• Visit important cultural or historical locations  
• Try a local activity  
• Explore the local area in the evening  

**Day 3 – Nature & Local Exploration**

• Visit a scenic location  
• Explore lesser-known areas  
• Try local cuisine before departure  

### 🍴 Food

Try the region's traditional dishes, street food and locally popular restaurants.

### 🚗 Transportation

Use local buses, metro/train services, taxis or app-based transport depending on what is available.

### 💰 Budget

Your mentioned budget: **${budget}**

Actual costs can vary depending on transport, accommodation, season and activities.

### 💡 SAFAR Tip

For a more specific plan, tell me:

**Destination + number of days + budget**

Example:

"Plan a 4-day trip to Patna and Bodh Gaya under ₹6000."
`;
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

        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

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

        const reply = response.text;

        return res.json({
            reply: reply
        });

    } catch (error) {

        console.error("Gemini Error:", error);

        // Gemini unavailable → show fallback instead of technical error
        return res.json({
            reply: getFallbackResponse(req.body.message)
        });
    }

});


module.exports = router;
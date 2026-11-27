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

CONVERSATION MEMORY RULES:

1. Remember the complete conversation history provided to you.
2. Remember the user's destination, duration, budget and travel preferences.
3. Remember the latest itinerary, including all previous changes.
4. If the user says "change Day 3", understand which trip they are referring to.
5. Change ONLY the requested day. Keep all unaffected days unchanged.
6. If weather, closures or other problems affect a place, suggest suitable alternatives.
7. Recalculate the estimated budget when itinerary changes affect costs.
8. Do not ask the user to repeat information already available in the conversation or trip state.

TRIP STATE:

Maintain these fields:
- destination
- duration
- budget
- interests
- itinerary
- completedDays
- changes
- remainingBudget

When a trip is being planned or updated, return the complete updated trip state.

RESPONSE FORMAT:

Always return valid JSON in this exact structure:

{
  "reply": "Your normal conversational response to the user",
  "tripState": {
    "destination": "Destination",
    "duration": "Number of days",
    "budget": "Trip budget",
    "interests": [],
    "itinerary": {},
    "completedDays": [],
    "changes": [],
    "remainingBudget": "Estimated remaining budget"
  }
}

If no trip has been created yet and the conversation is not about trip planning, tripState can be null.

When updating an existing trip, preserve all previous information that has not changed.


`;

// --------------------------------------------------
// GENERATE GEMINI RESPONSE WITH RETRY
// --------------------------------------------------



   






async function generateSafarResponse(message, history = [], tripState = null) {

    const models = [
        "gemini-3.1-flash-lite",
        "gemini-flash-lite-latest",
        "gemini-3-flash-preview"
    ];

    let lastError;

    // Validate and limit conversation history
    const safeHistory = Array.isArray(history)
        ? history
            .filter(item =>
                item &&
                ["user", "assistant"].includes(item.role) &&
                typeof item.content === "string"
            )
            .slice(-20)
        : [];

    // Avoid sending the latest user message twice
    const lastMessage = safeHistory[safeHistory.length - 1];

    if (
        !lastMessage ||
        lastMessage.role !== "user" ||
        lastMessage.content.trim() !== message.trim()
    ) {
        safeHistory.push({
            role: "user",
            content: message
        });
    }

    // Convert frontend history into Gemini format
    const contents = safeHistory.map(item => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.content }]
    }));

    // Include current trip information
    const systemPrompt = `
${SAFAR_PROMPT}

CURRENT TRIP STATE:

${JSON.stringify(tripState || {}, null, 2)}

Use the conversation history and current trip state together.
Preserve the existing itinerary when making changes.
Return valid JSON in the required response format.
`;

    for (const model of models) {

        try {

            console.log(`Trying Gemini model: ${model}`);

            const response = await ai.models.generateContent({

                model: model,

                contents: contents,

                config: {
                    systemInstruction: systemPrompt,
                    responseMimeType: "application/json"
                }

            });

            console.log(`Gemini API SUCCESS: ${model}`);

            const rawResponse = response.text;

            let result;

            try {
                result = JSON.parse(rawResponse);
            } catch (parseError) {

                console.error("Gemini returned invalid JSON:", rawResponse);

                return {
                    reply: rawResponse,
                    tripState: tripState
                };

            }

            return {
                reply: result.reply || "Your trip plan is ready!",
                tripState: result.tripState ?? tripState
            };

        } catch (error) {

            lastError = error;

            console.error(
                `${model} failed:`,
                error?.message || error
            );

            const status = error?.status || error?.code;

            // Try the next model for temporary or limit errors
            if (
                status !== 429 &&
                status !== 503 &&
                status !== 500
            ) {
                throw error;
            }

        }

    }

    throw lastError || new Error("All Gemini models failed.");

}



// --------------------------------------------------
// CHAT API
// --------------------------------------------------

router.post("/", async (req, res) => {

    try {

       const { message, history, tripState } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Please enter a travel question."
            });
        }

        // Handle greetings without Gemini
        const greetings = [
            "hi",
            "hello",
            "hey",
            "hii",
            "helo",
            "namaste",
            "good morning",
            "good afternoon",
            "good evening"
        ];

        const userMessage = message.trim().toLowerCase();

        if (greetings.includes(userMessage)) {
            return res.json({
                reply: `Hello! 👋 I'm SAFAR AI, your travel assistant.

I can help you plan trips, find places to visit, estimate budgets, suggest food, and create day-by-day itineraries.

Try asking:
"Plan a 3-day trip to Agra"
or
"Plan a 5-day Rajasthan trip under ₹8000"`
            });
        }

        // Gemini is called only for actual travel questions
      const result = await generateSafarResponse(
    message,
    history,
    tripState
);

       return res.json({
    reply: result.reply,
    tripState: result.tripState
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
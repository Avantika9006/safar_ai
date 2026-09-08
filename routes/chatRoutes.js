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

    // =========================
    // HIMACHAL PRADESH
    // =========================
    if (
        text.includes("himachal") ||
        text.includes("manali") ||
        text.includes("shimla")
    ) {
        return `
# 🌍 SAFAR AI — Himachal Pradesh Trip Plan

## 📍 Trip Overview

- **Destination:** Himachal Pradesh
- **Duration:** 3 Days
- **Best for:** Mountains, nature, sightseeing & local food
- **Travel Style:** Budget-friendly

## 💰 Approximate Budget

| Category | Estimated Cost |
|---|---:|
| Transport | ₹1,500–₹2,500 |
| Stay | ₹1,500–₹2,500 |
| Food | ₹1,000–₹1,500 |
| Sightseeing | ₹500–₹1,000 |
| **Total** | **₹4,500–₹7,500 approx.** |

## 🗓️ DAY 1 — SHIMLA 🏔️

### 🌅 Morning
📍 **The Ridge & Christ Church**
- Walk around The Ridge.
- Enjoy the mountain views.
- Visit the historic Christ Church.

### ☀️ Afternoon
📍 **Mall Road**
- Explore Mall Road.
- Try local cafés and street food.
- Visit **Lakkar Bazaar** for wooden handicrafts.

### 🌆 Evening
📍 **Jakhoo Temple**
- Visit the famous hilltop temple.
- Enjoy panoramic views of Shimla.

### 🍽️ Try These
- Himachali Dham
- Siddu
- Momos
- Chai

## 🗓️ DAY 2 — MANALI 🌲

### 🌅 Morning
📍 **Hadimba Temple**
- Visit the famous cedar-forest temple.
- Explore the surrounding forest.

### ☀️ Afternoon
📍 **Old Manali**
- Explore cafés and local shops.
- Walk around the riverside area.

### 🌆 Evening
📍 **Mall Road, Manali**
- Shopping and local food.
- Relax and enjoy the mountain atmosphere.

### 🍽️ Try These
- Siddu
- Thukpa
- Momos
- Chana Madra

## 🗓️ DAY 3 — SOLANG VALLEY ❄️

### 🌅 Morning
📍 **Solang Valley**
- Enjoy beautiful mountain scenery.
- Try suitable seasonal activities.

### ☀️ Afternoon
📍 **Atal Tunnel / nearby sightseeing**
- Visit if travel conditions and time permit.
- Check local road conditions before travelling.

### 🌆 Evening
- Return towards Manali.
- Shop for local souvenirs.

## 🚗 HOW TO TRAVEL

- Use buses/Volvo services for major routes.
- Use local cabs for sightseeing.
- Shared taxis can help reduce costs.
- Mountain travel can take longer than expected.

## 🏨 WHERE TO STAY

**Shimla:** Stay around the main town or nearby accessible areas.

**Manali:** Old Manali or areas close to the main market can be convenient.

Choose budget hotels/hostels/homestays and verify current prices before booking.

## ⭐ MUST-VISIT PLACES

🏔️ The Ridge  
🌲 Old Manali  
🛕 Hadimba Temple  
❄️ Solang Valley  
🛍️ Mall Road  
🌳 Lakkar Bazaar  

## 🛡️ SAFAR SAFETY TIPS

- Check weather and road conditions before mountain travel.
- Carry warm clothing.
- Keep some cash for local transport.
- Avoid travelling on unfamiliar mountain roads late at night.
- Follow local instructions at high-altitude locations.

## 💡 SAVE MONEY

- Use buses/shared transport.
- Choose budget accommodation.
- Eat at local restaurants.
- Group nearby attractions together.

## ⚠️ SAFAR NOTE

Travel time, weather, road conditions, entry fees and accommodation
prices can change. Verify the latest information before travelling.

*SAFAR AI is currently using its travel fallback database.*
`;
    }


    // =========================
    // GOA
    // =========================
    if (text.includes("goa")) {
        return `
# 🌴 SAFAR AI — Goa Trip Plan

## 📍 Trip Overview

- **Duration:** 3 Days
- **Best for:** Beaches, food, sightseeing & relaxation

## 🗓️ DAY 1 — NORTH GOA

🏖️ Baga Beach  
🏖️ Calangute Beach  
🏰 Fort Aguada  

### 🍽️ Try
- Goan fish curry
- Poi bread
- Bebinca

## 🗓️ DAY 2 — OLD GOA

⛪ Basilica of Bom Jesus  
⛪ Se Cathedral  
🌊 Miramar Beach  
🌅 Sunset experience

## 🗓️ DAY 3 — SOUTH GOA

🏖️ Palolem Beach  
🌴 Colva Beach  
🛍️ Local market

## 💰 Budget

Approximately **₹5,000–₹8,000 per person**, depending on transport and stay.

Verify current prices before booking.

*SAFAR AI fallback mode.*
`;
    }


    // =========================
    // RAJASTHAN
    // =========================
    if (text.includes("rajasthan") || text.includes("jaipur")) {
        return `
# 🕌 SAFAR AI — Rajasthan Trip Plan

## 🗓️ DAY 1 — JAIPUR

🏰 Amber Fort  
🏛️ City Palace  
📸 Hawa Mahal  
🛍️ Johari Bazaar

### 🍽️ Try
- Dal Baati Churma
- Ghewar
- Pyaaz Kachori

## 🗓️ DAY 2 — JAIPUR

🌅 Nahargarh Fort  
🔭 Jantar Mantar  
🏛️ Albert Hall Museum  
🌆 Local market

## 🗓️ DAY 3 — LOCAL EXPERIENCE

🎨 Explore handicraft markets  
🍽️ Try traditional Rajasthani food  
📸 Explore historic streets

**Estimated budget:** ₹5,000–₹8,000 excluding long-distance travel.

*SAFAR AI fallback mode.*
`;
    }


    // =========================
    // KERALA
    // =========================
    if (text.includes("kerala") || text.includes("munnar") || text.includes("alleppey")) {
        return `
# 🌴 SAFAR AI — Kerala Trip Plan

## 🗓️ DAY 1 — KOCHI

🏛️ Fort Kochi  
🎨 Chinese Fishing Nets  
⛪ St. Francis Church  
🌅 Marine Drive

## 🗓️ DAY 2 — MUNNAR

🌿 Tea Gardens  
🏔️ Mountain viewpoints  
🌱 Tea Museum

## 🗓️ DAY 3 — ALLEPPEY

🚤 Backwater experience  
🌴 Explore local surroundings  
🍛 Try traditional Kerala cuisine

### 🍽️ Try
- Appam & stew
- Kerala Sadya
- Puttu & kadala curry

**Estimated budget:** ₹6,000–₹10,000 depending on stay and transport.

*SAFAR AI fallback mode.*
`;
    }


    // =========================
    // BIHAR
    // =========================
    if (text.includes("bihar") || text.includes("bodh gaya") || text.includes("rajgir")) {
        return `
# 🏛️ SAFAR AI — Bihar Trip Plan

## 🗓️ DAY 1 — PATNA

🏛️ Bihar Museum  
🏛️ Golghar  
🌳 Gandhi Maidan

### 🍽️ Try
- Litti Chokha
- Sattu Sharbat

## 🗓️ DAY 2 — BODH GAYA

🛕 Mahabodhi Temple  
🏯 Thai Monastery  
🌳 Great Buddha Statue

## 🗓️ DAY 3 — RAJGIR

🏔️ Vishwa Shanti Stupa  
🏛️ Rajgir historical sites  
🌳 Local sightseeing

**Estimated budget:** ₹4,000–₹7,000 depending on transport and accommodation.

*SAFAR AI fallback mode.*
`;
    }


    // =========================
    // UNKNOWN DESTINATION
    // =========================

    let destination = "your destination";

    const match = message.match(
        /(?:trip to|travel to|visit|trip in)\\s+(.+?)(?:\\s+under|\\s+for|\\s+with|$)/i
    );

    if (match) {
        destination = match[1].trim();
    }

    return `
# 🌍 SAFAR AI TRIP PLAN

## 📍 ${destination}

I can help you plan a trip to **${destination}**.

### 🗓️ Suggested 3-Day Structure

**DAY 1 — Main Attractions**
- Visit the most popular landmark.
- Explore the local area.
- Try regional food.

**DAY 2 — Experiences**
- Explore cultural, historical or natural attractions.
- Visit a local market.
- Enjoy a local food experience.

**DAY 3 — Hidden Gems**
- Explore a less-crowded attraction.
- Try a local activity.
- Shop for local souvenirs.

### 🍽️ Food

Try authentic local cuisine and popular regional dishes.

### 🚗 Transportation

Use public transport or reliable local taxis where practical.

### 🏨 Stay

Consider budget hotels, hostels or homestays near major attractions.

### 🛡️ Safety

Check current weather, transport conditions and local travel advisories
before travelling.

### ⚠️ Important

This is a fallback plan because the AI service is temporarily unavailable.
For accurate current prices, weather, hotel availability and detailed
destination-specific recommendations, verify the latest information
before travelling.

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
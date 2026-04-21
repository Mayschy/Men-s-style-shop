const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Product = require("../models/Product");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Base product page URL
const PRODUCT_BASE_URL = "https://mens-style-shop.vercel.app/product/";

// Language name mapping
const LANGUAGE_NAMES = {
  en: "English",
  uk: "Ukrainian",
};

// Escalation trigger phrases
const ESCALATION_TRIGGERS = [
  "talk to a human",
  "speak to someone",
  "real person",
  "customer support",
  "help from a person",
  "contact support",
  "talk to real support",
  "speak to support",
  "operator",
  "agent",
  "live chat",
  "call support",
  "talk to manager",
];

// Build formatted stock string for a product
function formatStock(sizes) {
  if (!sizes || sizes.length === 0) return "No size data";
  return sizes
    .map((s) => `Size ${s.size}: ${s.stock > 0 ? s.stock + " in stock" : "OUT OF STOCK"}`)
    .join(", ");
}

// Build product catalog string for the system prompt
async function buildProductCatalog() {
  const products = await Product.find(
    {},
    "name description price category styleTags sizes"
  ).lean();

  return products
    .map((p) => {
      const stockInfo = formatStock(p.sizes);
      const tags = (p.styleTags || []).join(", ");
      return `Product: ${p.name} | ID: ${p._id} | Category: ${p.category} | Price: $${p.price} | Stock: ${stockInfo} | Tags: ${tags || "none"} | Description: ${p.description}`;
    })
    .join("\n");
}

// Check if message contains escalation trigger
function shouldEscalate(message) {
  const lower = message.toLowerCase();
  return ESCALATION_TRIGGERS.some((trigger) => lower.includes(trigger));
}

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { message, lang } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Determine language (default to English)
    const languageCode = lang || "en";
    const languageName = LANGUAGE_NAMES[languageCode] || "English";

    // Build catalog once
    const catalog = await buildProductCatalog();

    const escalationFlag = shouldEscalate(message);

    const systemPrompt = `You are an expert style consultant for "Men's Style Shop" — a premium men's clothing store.

IMPORTANT: You MUST respond strictly in ${languageName} language. Even if the user writes in another language, stay consistent with ${languageName} and respond only in ${languageName}. This is critical — the site UI is in ${languageName} and the user expects to be answered in ${languageName}.

Your expertise covers two domains:
1. **Fashion & Style**: You know the latest men's trends, how to dress for body types, match outfits, and pick the right sizes.
2. **Digital Art & Paintings**: You can discuss styles, artists, and art theory in depth.

## Product Catalog
${catalog || "No products available at the moment."}

## Product Links
When recommending a product, include the direct link as a RAW URL on its own line. Do NOT use markdown link syntax. Just output the URL by itself.

Format:
${PRODUCT_BASE_URL}[PRODUCT_ID]

Example — output exactly like this:
Great choice! The Lightweight Bomber Jacket ($129) is available in Size M with 5 units in stock.
${PRODUCT_BASE_URL}64f1a2b3c4d5e6f7a8b9c0d1

Do NOT write: "Here's the link: ..." or "Check it out: ..." or use [text](url) format.
Just give the URL on its own line after your recommendation.

## Stock & Availability
- When a user asks about availability or a specific size, check the "Stock" field in the catalog.
- If a size shows "OUT OF STOCK", inform the user politely in ${languageName}.
- If a requested size is unavailable, ALWAYS suggest an available alternative size from the same product.
- Example response for out-of-stock: "Unfortunately, Size M is currently OUT OF STOCK. However, Size L is available with 3 units — want me to show you? The link: ${PRODUCT_BASE_URL}[ID]"

## Guidelines
- Use the product catalog above to make specific, relevant recommendations.
- ALWAYS respond in ${languageName} language only.
- ALWAYS output the product URL on its own line when mentioning a specific product.
- Check stock availability for any size mentioned before confirming.
- If a requested size is unavailable, suggest an alternative and reference available sizes.
- Ask clarifying questions about budget, occasion, or style preference to give better advice.
- Keep responses concise (2-4 sentences for general questions, up to 2 paragraphs for detailed style advice).
- If you mention a specific product, include its name, price, AND the raw URL on a separate line.
- Always be friendly, professional, and encouraging.

## Escalation
If the user explicitly asks to speak to a human, customer support, or a real person — respond with ONLY the word: __ESCALATE__
Do not explain, do not apologize, do not suggest alternatives. Just output __ESCALATE__ and nothing else.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 800,
      temperature: 0.8,
    });

    let reply = completion.choices[0].message.content.trim();

    // If escalation triggered, return flag instead of raw AI response
    if (reply === "__ESCALATE__" || escalationFlag) {
      return res.json({
        reply:
          "I'm connecting you with our support team. You can reach us via:\n\n📱 **Telegram**: @mensstyleshop\n📧 **Email**: support@mensstyleshop.com\n\nWe'll get back to you shortly!",
        escalate: true,
      });
    }

    res.json({ reply, escalate: false });
  } catch (err) {
    console.error("AI Chat error:", err.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

module.exports = router;
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

// Escalation messages by language
const ESCALATION_MESSAGES = {
  en: "I'm connecting you with our support team. You can reach us via:\n\n📱 Telegram: @Mayushy\n📧 Email: mvasilyev2016@gmail.com\n\nWe'll get back to you shortly!",
  uk: "З'єднуємо вас з нашою службою підтримки. Ви можете зв'язатися з нами:\n\n📱 Telegram: @Mayushy\n📧 Email: mvasilyev2016@gmail.com\n\nМи скоро відповімо!",
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
  "поговорити з людиною",
  "живий оператор",
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
    "name description price category styleTags sizes imageUrl"
  ).lean();

  return products
    .map((p) => {
      const stockInfo = formatStock(p.sizes);
      const tags = (p.styleTags || []).join(", ");
      const image = p.imageUrl || "";
      return `Product: ${p.name} | ID: ${p._id} | Category: ${p.category} | Price: $${p.price} | Stock: ${stockInfo} | Tags: ${tags || "none"} | Image: ${image} | Description: ${p.description}`;
    })
    .join("\n");
}

// Check if message contains escalation trigger
function shouldEscalate(message) {
  if (!message || typeof message !== "string") return false;
  const lower = message.toLowerCase();
  return ESCALATION_TRIGGERS.some((trigger) => lower.includes(trigger));
}

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { message, lang } = req.body;

    // Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Determine language (default to English)
    const languageCode = lang && typeof lang === "string" ? lang : "en";
    const languageName = LANGUAGE_NAMES[languageCode] || "English";
    const escalationMsg = ESCALATION_MESSAGES[languageCode] || ESCALATION_MESSAGES.en;

    // Build catalog once
    const catalog = await buildProductCatalog();

    const escalationFlag = shouldEscalate(message);

    const systemPrompt = `You are an expert style consultant for Men's Style Shop — a premium men's clothing store.

IMPORTANT: You MUST respond strictly in ${languageName} language. Even if the user writes in another language, stay consistent with ${languageName} and respond only in ${languageName}.

Your expertise covers two domains:
1. Fashion & Style: You know the latest men's trends, how to dress for body types, match outfits, and pick the right sizes.
2. Digital Art & Paintings: You can discuss styles, artists, and art theory in depth.

## Formatting Rules (CRITICAL)
- MINIMIZE use of **bold** formatting. Only use it sparingly for product names.
- Do NOT use quotation marks around anything.
- Keep formatting simple and clean.
- NEVER put an image inside a sentence. Images go AFTER your response, on their own line.

## Product Catalog
${catalog || "No products available at the moment."}

## Product Recommendations — Image & Link Format
When recommending a product, follow this EXACT format (product image AFTER the text, then link on its own line):

First, write your recommendation text normally.
Then on a new line, put the image.
Then on another new line, put the link.

Example:
Great choice! The Lightweight Bomber Jacket ($129) is available in Size M with 5 units in stock.
![Lightweight Bomber Jacket](https://example.com/image.jpg)
[View Product Details](https://mens-style-shop.vercel.app/product/64f1a2b3c4d5e6f7a8b9c0d1)

Do NOT interleave image or links within sentences. Do NOT use bare URLs.

## Stock & Availability
- When a user asks about availability or a specific size, check the Stock field in the catalog.
- If a size shows OUT OF STOCK, inform the user politely.
- If a requested size is unavailable, suggest an available alternative size.

## Guidelines
- Use the product catalog to make specific recommendations.
- Always respond in ${languageName} language only.
- Put product images AFTER your text, not inside sentences.
- Put product links AFTER images, on their own line.
- Check stock availability before confirming.
- Keep responses concise and friendly.
- Do NOT use excessive bold (**) or quotation marks.

## Escalation
If the user asks to speak to a human or customer support, respond with ONLY: __ESCALATE__`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    // Safely extract reply
    const rawReply = completion?.choices?.[0]?.message?.content;
    let reply = typeof rawReply === "string" ? rawReply.trim() : "";

    // If no reply, return error
    if (!reply) {
      return res.status(500).json({ error: "Failed to get AI response" });
    }

    // If escalation triggered, return localized escalation message
    if (reply === "__ESCALATE__" || escalationFlag) {
      return res.json({
        reply: escalationMsg,
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
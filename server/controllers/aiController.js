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
  en: "I'm connecting you with our support team. You can reach us via:\n\n📱 **Telegram**: @mensstyleshop\n📧 **Email**: support@mensstyleshop.com\n\nWe'll get back to you shortly!",
  uk: "З'єднуємо вас з нашою службою підтримки. Ви можете зв'язатися з нами:\n\n📱 **Telegram**: @mensstyleshop\n📧 **Email**: support@mensstyleshop.com\n\nМи скоро відповімо!",
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

    const systemPrompt = `You are an expert style consultant for "Men's Style Shop" — a premium men's clothing store.

IMPORTANT: You MUST respond strictly in ${languageName} language. Even if the user writes in another language, stay consistent with ${languageName} and respond only in ${languageName}. This is critical — the site UI is in ${languageName} and the user expects to be answered in ${languageName}.

Your expertise covers two domains:
1. **Fashion & Style**: You know the latest men's trends, how to dress for body types, match outfits, and pick the right sizes.
2. **Digital Art & Paintings**: You can discuss styles, artists, and art theory in depth.

## Product Catalog
${catalog || "No products available at the moment."}

## Product Recommendations with Images & Links
When recommending a product, you MUST include BOTH the product image AND a link using this exact Markdown format:

**[Product Name]** ![Product Image](imageUrl)   [View Product Details](https://mens-style-shop.vercel.app/product/ID)

Example — output exactly like this:
Great choice! The **Lightweight Bomber Jacket** ($129) is available in Size M with 5 units in stock.
**Lightweight Bomber Jacket** ![Lightweight Bomber Jacket](https://example.com/image.jpg)   [View Product Details](https://mens-style-shop.vercel.app/product/64f1a2b3c4d5e6f7a8b9c0d1)

Do NOT use bare URLs. Always combine image + link on the same line as shown above.
If the product has no image available, still provide the link: [View Product Details](https://mens-style-shop.vercel.app/product/ID)

## Stock & Availability
- When a user asks about availability or a specific size, check the "Stock" field in the catalog.
- If a size shows "OUT OF STOCK", inform the user politely in ${languageName}.
- If a requested size is unavailable, ALWAYS suggest an available alternative size from the same product.
- Example response for out-of-stock: "Unfortunately, Size M is currently OUT OF STOCK. However, Size L is available with 3 units — want me to show you? **Lightweight Bomber Jacket** ![Lightweight Bomber Jacket](imageUrl)   [View Product Details](https://mens-style-shop.vercel.app/product/ID)"

## Guidelines
- Use the product catalog above to make specific, relevant recommendations.
- ALWAYS respond in ${languageName} language only.
- ALWAYS use the image + link Markdown format when recommending a product.
- Check stock availability for any size mentioned before confirming.
- If a requested size is unavailable, suggest an alternative and reference available sizes.
- Ask clarifying questions about budget, occasion, or style preference to give better advice.
- Keep responses concise (2-4 sentences for general questions, up to 2 paragraphs for detailed style advice).
- If you mention a specific product, include its name, price, image, AND link.
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
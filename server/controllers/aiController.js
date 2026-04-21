const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Product = require("../models/Product");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Build product catalog string for the system prompt
async function buildProductCatalog() {
  const products = await Product.find({}, "name description price category styleTags imageUrl").lean();
  return products
    .map(
      (p) =>
        `- ${p.name} | Price: $${p.price} | Category: ${p.category} | Tags: ${(p.styleTags || []).join(", ")} | Description: ${p.description}`
    )
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
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build catalog once
    const catalog = await buildProductCatalog();

    const escalationFlag = shouldEscalate(message);

    const systemPrompt = `You are an expert style consultant for "Men's Style Shop" — a premium men's clothing store.

Your expertise covers two domains:
1. **Fashion & Style**: You know the latest men's trends, how to dress for body types, match outfits, and pick the right sizes.
2. **Digital Art & Paintings**: You can discuss styles, artists, and art theory in depth.

## Product Catalog
The following products are available in our store:
${catalog || "No products available at the moment."}

## Guidelines
- Use the product catalog above to make specific, relevant recommendations.
- Ask clarifying questions about budget, occasion, or style preference to give better advice.
- Keep responses concise (2-4 sentences for general questions, up to 2 paragraphs for detailed style advice).
- If you mention a specific product, include its name and price.
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
      max_tokens: 500,
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
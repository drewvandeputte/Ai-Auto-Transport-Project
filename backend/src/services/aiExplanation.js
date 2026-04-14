// ============================================================
// AutoRoute AI — AI Explanation Service
// ============================================================
// Calls the Anthropic API to generate a plain-English
// explanation of why the top carrier was recommended.
// ============================================================

const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate a 2–3 sentence explanation for the top carrier recommendation.
 * @param {Object} topCarrier - The highest-scored carrier object
 * @param {Object} quoteRequest - The user's original quote request
 * @returns {string} Plain-English explanation from Claude
 */
async function generateExplanation(topCarrier, quoteRequest) {
  const prompt = `
You are a helpful auto transport advisor. A customer wants to ship their
${quoteRequest.vehicleYear} ${quoteRequest.vehicleMake} ${quoteRequest.vehicleModel}
from ZIP ${quoteRequest.pickupZip} to ZIP ${quoteRequest.deliveryZip}
via ${quoteRequest.transportType} transport on ${quoteRequest.shipDate}.

Based on price, carrier rating, transit time, and insurance coverage,
we recommend ${topCarrier.name} at $${topCarrier.priceUSD} with a ${topCarrier.rating}-star
rating, ${topCarrier.transitDays}-day transit, and $${topCarrier.insuranceUSD.toLocaleString()} insurance coverage.

Write 2–3 sentences in plain English explaining why this carrier is the best choice
for this specific shipment. Be warm, direct, and specific. Do not use bullet points.
  `.trim();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0].text;
}

module.exports = { generateExplanation };

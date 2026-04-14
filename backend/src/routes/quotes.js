// ============================================================
// AutoRoute AI — Quotes Route
// ============================================================
// POST /api/quotes
//   Accepts a quote request, scores carriers, generates an AI
//   explanation, and returns ranked results to the frontend.
// ============================================================

const express = require('express');
const router  = express.Router();

const { scoreAndRankCarriers } = require('../services/scoring');
const { generateExplanation }  = require('../services/aiExplanation');
const { saveQuote }            = require('../services/database');

router.post('/', async (req, res) => {
  try {
    const {
      pickupZip,
      deliveryZip,
      vehicleYear,
      vehicleMake,
      vehicleModel,
      transportType, // 'open' or 'enclosed'
      shipDate,
    } = req.body;

    // Basic validation — make sure all required fields are present
    if (!pickupZip || !deliveryZip || !vehicleYear || !vehicleMake || !vehicleModel || !transportType || !shipDate) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Score and rank carriers using the weighted formula
    const rankedCarriers = scoreAndRankCarriers(req.body);
    const topCarrier     = rankedCarriers[0];

    // Generate plain-English AI explanation for the top pick
    const explanation = await generateExplanation(topCarrier, req.body);

    // Save the quote to the database
    await saveQuote(req.body, topCarrier, explanation);

    res.json({
      success: true,
      quoteRequest: req.body,
      rankedCarriers,
      topCarrier,
      explanation,
    });
  } catch (err) {
    console.error('Error processing quote:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;

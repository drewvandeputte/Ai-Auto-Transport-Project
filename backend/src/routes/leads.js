// ============================================================
// AutoRoute AI — Leads Route
// ============================================================
// POST /api/leads
//   Saves a user's contact info and selected carrier as a lead.
//   This is the "booking intent" capture — no payment taken.
// ============================================================

const express        = require('express');
const router         = express.Router();
const { saveLead }   = require('../services/database');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, carrierName, carrierPrice,
            pickupZip, deliveryZip, vehicleYear, vehicleMake,
            vehicleModel, transportType, shipDate } = req.body;

    // Basic validation
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required.' });
    }

    await saveLead(req.body);

    res.json({ success: true, message: 'Lead saved successfully.' });
  } catch (err) {
    console.error('Error saving lead:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;

// ============================================================
// AutoRoute AI — Admin Routes
// ============================================================
// GET /api/admin/quotes — all quote requests
// GET /api/admin/leads  — all booking intent leads
// ============================================================

const express          = require('express');
const router           = express.Router();
const { getAllQuotes, getAllLeads } = require('../services/database');

router.get('/quotes', async (req, res) => {
  try {
    const quotes = await getAllQuotes();
    res.json({ success: true, quotes });
  } catch (err) {
    console.error('Error fetching quotes:', err);
    res.status(500).json({ error: 'Could not fetch quotes.' });
  }
});

router.get('/leads', async (req, res) => {
  try {
    const leads = await getAllLeads();
    res.json({ success: true, leads });
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Could not fetch leads.' });
  }
});

module.exports = router;

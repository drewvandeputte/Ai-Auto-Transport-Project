// ============================================================
// AutoRoute AI — Admin Route
// ============================================================
// GET /api/admin/quotes
//   Returns all quotes submitted through the platform,
//   newest first. Used by the internal admin dashboard.
// ============================================================

const express      = require('express');
const router       = express.Router();
const { getAllQuotes } = require('../services/database');

router.get('/quotes', async (req, res) => {
  try {
    const quotes = await getAllQuotes();
    res.json({ success: true, quotes });
  } catch (err) {
    console.error('Error fetching quotes:', err);
    res.status(500).json({ error: 'Could not fetch quotes.' });
  }
});

module.exports = router;

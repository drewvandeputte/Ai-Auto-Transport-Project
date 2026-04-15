// ============================================================
// AutoRoute AI — Leads Route
// ============================================================
// POST /api/leads
//   Saves a user's contact info and selected carrier as a lead.
//   This is the "booking intent" capture — no payment taken.
// ============================================================

const express      = require('express');
const router       = express.Router();
const { saveLead } = require('../services/database');
const { Pool }     = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// POST /api/leads — save a new lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

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

// PATCH /api/leads/:id/status — update a lead's status from the admin dashboard
router.patch('/:id/status', async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    const allowed = ['confirmed', 'contacted', 'booked', 'in_transit', 'delivered', 'cancellation_requested', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    await pool.query('UPDATE leads SET status = $1 WHERE id = $2', [status, id]);

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating lead status:', err);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

module.exports = router;

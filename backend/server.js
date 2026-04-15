// ============================================================
// AutoRoute AI — Express Backend Entry Point
// ============================================================
// This file starts the server and wires up all API routes.
// Run with: npm run dev
// ============================================================

require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors    = require('cors');

const quotesRouter = require('./src/routes/quotes');
const adminRouter  = require('./src/routes/admin');
const leadsRouter  = require('./src/routes/leads');
const chatRouter   = require('./src/routes/chat');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────
// Allow the React frontend (running on port 5173) to call this API
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
// POST /api/quotes  — submit a new quote request, get AI results back
// GET  /api/admin   — view all quotes (internal use only)
app.use('/api/quotes', quotesRouter);
app.use('/api/admin',  adminRouter);
app.use('/api/leads',  leadsRouter);
app.use('/api/chat',   chatRouter);

// ── Health check ─────────────────────────────────────────────
// Quick endpoint to confirm the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AutoRoute AI backend is running' });
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`AutoRoute AI backend running on http://localhost:${PORT}`);
});

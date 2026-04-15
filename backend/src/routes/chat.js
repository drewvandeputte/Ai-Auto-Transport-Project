// ============================================================
// AutoRoute AI — Chat Route
// ============================================================
// POST /api/chat
//   Accepts a conversation history, calls Claude, and returns
//   an AI response. Also handles side effects:
//     - cancellation_request → flags DB + emails admin
//     - status_check         → looks up booking in DB
//     - escalate             → emails admin for follow-up
// ============================================================

const express    = require('express');
const router     = express.Router();
const { chat }   = require('../services/chatService');
const { getLeadByEmail, flagCancellation } = require('../services/database');
const { sendCancellationAlert, sendEscalationAlert } = require('../services/emailService');

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required.' });
    }

    // First Claude call — get response + intent
    const result = await chat(messages);

    // ── Handle: shipment status check ───────────────────────
    if (result.action === 'status_check' && result.userEmail) {
      const lead = await getLeadByEmail(result.userEmail);

      if (lead) {
        // Build a context string and ask Claude to respond with the real data
        const statusContext = `
Customer: ${lead.name}
Vehicle:  ${lead.vehicle_year} ${lead.vehicle_make} ${lead.vehicle_model}
Route:    ${lead.pickup_zip} → ${lead.delivery_zip}
Carrier:  ${lead.carrier_name}
Status:   ${lead.status}
Booked:   ${new Date(lead.created_at).toLocaleDateString()}
        `.trim();

        // Second Claude call with booking context injected
        const enriched = await chat(messages, statusContext);
        return res.json({ message: enriched.message });
      } else {
        // No booking found — Claude already asked for email, return a not-found message
        return res.json({
          message: `I wasn't able to find a booking associated with ${result.userEmail}. Please double-check the email you used when booking, or our team can look into it for you — just let us know!`,
        });
      }
    }

    // ── Handle: cancellation request ────────────────────────
    if (result.action === 'cancellation_request' && result.userEmail) {
      const lead = await getLeadByEmail(result.userEmail);
      const flagged = await flagCancellation(result.userEmail);

      // Send admin alert (fails silently if email not configured)
      sendCancellationAlert(result.userEmail, lead).catch(err =>
        console.error('[Email] Failed to send cancellation alert:', err.message)
      );

      if (!flagged) {
        // Email not matched — still respond gracefully
        return res.json({
          message: `I've noted your cancellation request, but I wasn't able to find a booking under ${result.userEmail}. Our team has been alerted and will follow up with you shortly to sort this out.`,
        });
      }
    }

    // ── Handle: escalation ──────────────────────────────────
    if (result.action === 'escalate') {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
      sendEscalationAlert(result.userEmail, lastUserMessage).catch(err =>
        console.error('[Email] Failed to send escalation alert:', err.message)
      );
    }

    // Return the message for all cases
    res.json({ message: result.message });

  } catch (err) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: 'Something went wrong with the chat. Please try again.' });
  }
});

module.exports = router;

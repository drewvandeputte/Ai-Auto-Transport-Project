// ============================================================
// AutoRoute AI — Email Service
// ============================================================
// Sends admin alert emails using nodemailer + Gmail.
//
// SETUP REQUIRED (one-time):
//   1. Go to your Google Account → Security → 2-Step Verification
//      (must be enabled first)
//   2. Go to Security → App Passwords
//   3. Create a new App Password for "Mail" / "Other"
//   4. Copy the 16-character password into your .env:
//        EMAIL_USER=drewvandeputte@gmail.com
//        EMAIL_PASS=your-16-char-app-password
//        ADMIN_EMAIL=drewvandeputte@gmail.com
// ============================================================

const nodemailer = require('nodemailer');

/**
 * Create a Gmail transporter.
 * Returns null if credentials are not configured — alerts will
 * be skipped gracefully rather than crashing the server.
 */
function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send a cancellation request alert to the admin.
 * @param {string} customerEmail - Email the customer provided in chat
 * @param {Object|null} lead     - Lead record from DB (may be null if not found)
 */
async function sendCancellationAlert(customerEmail, lead) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Email] Skipping cancellation alert — EMAIL_USER/EMAIL_PASS not configured in .env');
    return;
  }

  const leadDetails = lead
    ? `
Name:     ${lead.name}
Phone:    ${lead.phone}
Vehicle:  ${lead.vehicle_year} ${lead.vehicle_make} ${lead.vehicle_model}
Route:    ${lead.pickup_zip} → ${lead.delivery_zip}
Carrier:  ${lead.carrier_name} ($${lead.carrier_price})
Booked:   ${new Date(lead.created_at).toLocaleDateString()}
Status:   ${lead.status}
    `.trim()
    : `No matching booking found for email: ${customerEmail}`;

  const mailOptions = {
    from:    process.env.EMAIL_USER,
    to:      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `⚠️ Cancellation Request — ${customerEmail}`,
    text: `
A customer has requested to cancel their shipment via the AI chat widget.

CUSTOMER EMAIL: ${customerEmail}

BOOKING DETAILS:
${leadDetails}

ACTION REQUIRED:
Please review this booking in the admin dashboard and process the cancellation.

— AutoRoute AI System
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
  console.log(`[Email] Cancellation alert sent for ${customerEmail}`);
}

/**
 * Send an escalation alert to the admin.
 * @param {string} customerEmail - Email the customer provided (may be null)
 * @param {string} lastMessage   - The customer's last message that triggered escalation
 */
async function sendEscalationAlert(customerEmail, lastMessage) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Email] Skipping escalation alert — EMAIL_USER/EMAIL_PASS not configured in .env');
    return;
  }

  const mailOptions = {
    from:    process.env.EMAIL_USER,
    to:      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `💬 Chat Escalation — Customer Needs Help`,
    text: `
A customer chat was escalated for human follow-up.

CUSTOMER EMAIL: ${customerEmail || 'Not provided'}

THEIR LAST MESSAGE:
"${lastMessage}"

Please follow up with this customer as soon as possible.

— AutoRoute AI System
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
  console.log(`[Email] Escalation alert sent`);
}

module.exports = { sendCancellationAlert, sendEscalationAlert };

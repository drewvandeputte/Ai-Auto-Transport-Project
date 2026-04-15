// ============================================================
// AutoRoute AI — Database Service
// ============================================================
// Handles all communication with the PostgreSQL database
// hosted on Supabase. Uses the 'pg' library.
// ============================================================

const { Pool } = require('pg');

// Create a connection pool using the DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase hosted connections
});

/**
 * Save a completed quote to the database.
 * @param {Object} quoteRequest - The user's form submission
 * @param {Object} topCarrier   - The highest-scored carrier
 * @param {string} explanation  - The AI-generated explanation
 */
async function saveQuote(quoteRequest, topCarrier, explanation) {
  const query = `
    INSERT INTO quotes (
      pickup_zip,
      delivery_zip,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      transport_type,
      ship_date,
      top_carrier_name,
      top_carrier_price,
      top_carrier_score,
      explanation
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id
  `;

  const values = [
    quoteRequest.pickupZip,
    quoteRequest.deliveryZip,
    quoteRequest.vehicleYear,
    quoteRequest.vehicleMake,
    quoteRequest.vehicleModel,
    quoteRequest.transportType,
    quoteRequest.shipDate,
    topCarrier.name,
    topCarrier.priceUSD,
    topCarrier.score,
    explanation,
  ];

  const result = await pool.query(query, values);
  return result.rows[0].id;
}

/**
 * Fetch all quotes from the database, newest first.
 * @returns {Array} List of quote rows
 */
async function getAllQuotes() {
  const result = await pool.query(
    'SELECT * FROM quotes ORDER BY created_at DESC'
  );
  return result.rows;
}

/**
 * Save a lead (contact info + selected carrier) to the database.
 * @param {Object} leadData - Name, email, phone, and shipment details
 */
async function saveLead(leadData) {
  const query = `
    INSERT INTO leads (
      name,
      email,
      phone,
      carrier_name,
      carrier_price,
      pickup_zip,
      delivery_zip,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      transport_type,
      ship_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id
  `;

  const values = [
    leadData.name,
    leadData.email,
    leadData.phone,
    leadData.carrierName,
    leadData.carrierPrice,
    leadData.pickupZip,
    leadData.deliveryZip,
    leadData.vehicleYear,
    leadData.vehicleMake,
    leadData.vehicleModel,
    leadData.transportType,
    leadData.shipDate,
  ];

  const result = await pool.query(query, values);
  return result.rows[0].id;
}

/**
 * Fetch all leads from the database, newest first.
 * @returns {Array} List of lead rows
 */
async function getAllLeads() {
  const result = await pool.query(
    'SELECT * FROM leads ORDER BY created_at DESC'
  );
  return result.rows;
}

/**
 * Look up a lead by email address (most recent booking first).
 * Used by the chat service to answer shipment status questions.
 * @param {string} email - Customer email address
 * @returns {Object|null} Lead row or null if not found
 */
async function getLeadByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM leads WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC LIMIT 1',
    [email]
  );
  return result.rows[0] || null;
}

/**
 * Flag a lead as cancellation requested.
 * Updates status and records the timestamp.
 * @param {string} email - Customer email address
 * @returns {boolean} true if a record was updated, false if not found
 */
async function flagCancellation(email) {
  const result = await pool.query(
    `UPDATE leads
     SET status = 'cancellation_requested',
         cancellation_requested_at = NOW()
     WHERE LOWER(email) = LOWER($1)
     RETURNING id`,
    [email]
  );
  return result.rowCount > 0;
}

module.exports = { saveQuote, getAllQuotes, saveLead, getAllLeads, getLeadByEmail, flagCancellation };

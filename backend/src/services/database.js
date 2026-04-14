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

module.exports = { saveQuote, getAllQuotes };

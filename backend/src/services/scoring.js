// ============================================================
// AutoRoute AI — Carrier Scoring Service
// ============================================================
// Scores each carrier using a weighted formula:
//   Price          40% — lower is better
//   Carrier rating 30% — higher is better (out of 5)
//   Transit time   20% — fewer days is better
//   Insurance      10% — higher coverage is better
//
// Returns carriers sorted best → worst with a 0–100 score.
// ============================================================

const CARRIERS = require('../data/carriers');

/**
 * Score and rank all carriers for a given quote request.
 * @param {Object} quoteRequest - The user's submitted quote details
 * @returns {Array} Carriers sorted by score, highest first
 */
function scoreAndRankCarriers(quoteRequest) {
  // Find the min/max values across all carriers so we can normalize
  // each metric to a 0–1 scale before applying weights.
  const prices    = CARRIERS.map(c => c.priceUSD);
  const ratings   = CARRIERS.map(c => c.rating);
  const days      = CARRIERS.map(c => c.transitDays);
  const insurance = CARRIERS.map(c => c.insuranceUSD);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const minDays = Math.min(...days);
  const maxDays = Math.max(...days);
  const minInsurance = Math.min(...insurance);
  const maxInsurance = Math.max(...insurance);

  const scored = CARRIERS.map(carrier => {
    // Normalize each metric to 0–1 (relative position among carriers).
    // For price and transit days, LOWER is better, so we invert the scale.
    const relativePrice   = 1 - (carrier.priceUSD     - minPrice)      / (maxPrice     - minPrice);
    const relativeRating  =     (carrier.rating        - minRating)     / (maxRating    - minRating);
    const relativeTransit = 1 - (carrier.transitDays  - minDays)       / (maxDays      - minDays);
    const relativeInsur   =     (carrier.insuranceUSD - minInsurance)   / (maxInsurance - minInsurance);

    // Apply a floor of 0.60 — any carrier that meets our vetting standards
    // starts at 60/100 and earns up to 100 based on how it compares to others.
    // This keeps scores in a realistic 76–95 range so a 4.8-star carrier
    // doesn't show a misleadingly low number like 70.
    const FLOOR = 0.60;
    const RANGE = 1 - FLOOR; // 0.40 points available above the floor

    const priceScore   = FLOOR + RANGE * relativePrice;
    const ratingScore  = FLOOR + RANGE * relativeRating;
    const transitScore = FLOOR + RANGE * relativeTransit;
    const insurScore   = FLOOR + RANGE * relativeInsur;

    // Apply weights (must sum to 1.0)
    const totalScore =
      priceScore   * 0.40 +
      ratingScore  * 0.30 +
      transitScore * 0.20 +
      insurScore   * 0.10;

    return {
      ...carrier,
      score: Math.round(totalScore * 100), // convert to 0–100 for display
    };
  });

  // Sort highest score first
  return scored.sort((a, b) => b.score - a.score);
}

module.exports = { scoreAndRankCarriers };

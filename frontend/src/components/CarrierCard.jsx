// ============================================================
// AutoRoute AI — Carrier Card Component
// ============================================================
// Displays a single carrier in the results list.
// Clicking the card navigates to the booking page.
// ============================================================

function CarrierCard({ carrier, rank, isTop, onSelect }) {
  return (
    <div
      className={`carrier-card ${isTop ? 'top-pick' : ''} carrier-card-clickable`}
      onClick={() => onSelect(carrier)}
    >
      {/* Badge only shown on the top carrier */}
      {isTop && (
        <span className="top-pick-badge">AI Top Pick</span>
      )}

      <div className="carrier-card-body">
        <div>
          <p className="carrier-name">#{rank} — {carrier.name}</p>
          <p className="carrier-meta">
            ⭐ {carrier.rating} stars &nbsp;|&nbsp;
            🕐 {carrier.transitDays} days &nbsp;|&nbsp;
            🛡 ${carrier.insuranceUSD.toLocaleString()} insurance
          </p>
        </div>
        <div className="carrier-price">
          <span className="carrier-price-amount">
            ${carrier.priceUSD.toLocaleString()}
          </span>
          <span className="carrier-score">Score: {carrier.score}/100</span>
          <span className="carrier-select-hint">Select →</span>
        </div>
      </div>
    </div>
  );
}

export default CarrierCard;

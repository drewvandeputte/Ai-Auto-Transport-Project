// ============================================================
// AutoRoute AI — Carrier Card Component
// ============================================================
// Displays a single carrier's details in the results list.
// Highlights the top-ranked carrier with a special border.
// ============================================================

function CarrierCard({ carrier, rank, isTop }) {
  return (
    <div className={`carrier-card ${isTop ? 'top-pick' : ''}`}>

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
        </div>
      </div>

    </div>
  );
}

export default CarrierCard;

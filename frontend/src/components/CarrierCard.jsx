// ============================================================
// AutoRoute AI — Carrier Card Component
// ============================================================
// Displays a single carrier in the results list.
// Clicking the card navigates to the booking page.
// ============================================================

import { StarIcon, ClockIcon, ShieldCheckIcon } from './Icons';

function CarrierCard({ carrier, rank, isTop, onSelect, brokerFee }) {
  const totalPrice = carrier.priceUSD + (brokerFee || 0);

  return (
    <div
      className={`carrier-card ${isTop ? 'top-pick' : ''} carrier-card-clickable`}
      onClick={() => onSelect(carrier)}
    >
      {isTop && (
        <span className="top-pick-badge">AI Top Pick</span>
      )}

      <div className="carrier-card-body">
        <div>
          <p className="carrier-name">#{rank} — {carrier.name}</p>
          <div className="carrier-meta">
            <span className="carrier-meta-item"><StarIcon size={13} /> {carrier.rating} stars</span>
            <span className="carrier-meta-sep">|</span>
            <span className="carrier-meta-item"><ClockIcon size={13} /> {carrier.transitDays} days</span>
            <span className="carrier-meta-sep">|</span>
            <span className="carrier-meta-item"><ShieldCheckIcon size={13} /> ${carrier.insuranceUSD.toLocaleString()} insured</span>
          </div>
        </div>
        <div className="carrier-price">
          <span className="carrier-price-amount">
            ${totalPrice.toLocaleString()}
          </span>
          <span className="carrier-price-breakdown">
            Carrier ${carrier.priceUSD.toLocaleString()} + ${brokerFee} AutoRoute fee
          </span>
          <span className="carrier-score">AI Score: {carrier.score}/100</span>
          <span className="carrier-select-hint">Select →</span>
        </div>
      </div>
    </div>
  );
}

export default CarrierCard;

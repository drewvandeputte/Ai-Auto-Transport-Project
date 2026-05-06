// ============================================================
// AutoRoute AI — Quote Received Confirmation Page
// ============================================================
// Shown immediately after form submission. Displays the
// estimated price range and sets expectations for the
// AI carrier report arriving within 24 business hours.
// ============================================================

function QuoteReceivedPage({ quoteData, onReset }) {
  const { quoteRequest, rankedCarriers } = quoteData;

  const brokerFee  = quoteRequest.transportType === 'enclosed' ? 199 : 149;
  const prices     = rankedCarriers.map(c => c.priceUSD);
  const minTotal   = Math.min(...prices) + brokerFee;
  const maxTotal   = Math.max(...prices) + brokerFee;

  const shipDateFormatted = new Date(quoteRequest.shipDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <main className="quote-received-page">

      {/* ── Confirmation header ──────────────────────────────── */}
      <div className="qr-header">
        <div className="qr-check">✓</div>
        <h2>Quote Request Received</h2>
        <p className="qr-sub">
          We're on it. Your AI carrier report will be in your inbox within
          24 business hours.
        </p>
      </div>

      {/* ── Two-column layout ────────────────────────────────── */}
      <div className="qr-layout">

        {/* Shipment summary */}
        <div className="qr-card">
          <h3>Your Shipment</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Vehicle</span>
              <span className="summary-value">
                {quoteRequest.vehicleYear} {quoteRequest.vehicleMake} {quoteRequest.vehicleModel}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Transport Type</span>
              <span className="summary-value" style={{ textTransform: 'capitalize' }}>
                {quoteRequest.transportType}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pickup ZIP</span>
              <span className="summary-value">{quoteRequest.pickupZip}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Delivery ZIP</span>
              <span className="summary-value">{quoteRequest.deliveryZip}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Target Ship Date</span>
              <span className="summary-value">{shipDateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Estimated price */}
        <div className="qr-card qr-price-card">
          <h3>Estimated Cost</h3>
          <div className="qr-price-range">
            <span className="qr-price-amount">
              ${minTotal.toLocaleString()} – ${maxTotal.toLocaleString()}
            </span>
            <span className="qr-price-includes">
              Includes ${brokerFee} AutoRoute AI flat fee
            </span>
          </div>
          <p className="qr-price-disclaimer">
            Final price depends on carrier availability and is confirmed in your
            report. Carrier rate shown is based on current market data for this route.
          </p>

          <div className="qr-what-next">
            <h4>What Happens Next</h4>
            <div className="next-steps-compact">
              <p className="next-step-compact">
                <span className="next-step-number">1</span>
                We post your shipment to our carrier network
              </p>
              <p className="next-step-compact">
                <span className="next-step-number">2</span>
                Our AI grades every bid on price, rating, and transit time
              </p>
              <p className="next-step-compact">
                <span className="next-step-number">3</span>
                You receive your carrier report within 24 business hours
              </p>
              <p className="next-step-compact">
                <span className="next-step-number">4</span>
                Confirm your carrier with one click — we handle the rest
              </p>
            </div>
          </div>

          <p className="qr-no-payment">No payment required until you confirm a carrier.</p>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn-secondary" onClick={onReset}>
          Submit Another Quote
        </button>
      </div>

    </main>
  );
}

export default QuoteReceivedPage;

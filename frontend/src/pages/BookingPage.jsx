// ============================================================
// AutoRoute AI — Booking Intent Page
// ============================================================
// Two-column layout on desktop: details on the left,
// sticky contact form on the right.
// Stacks to single column on mobile.
// ============================================================

import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function calcDeliveryDate(shipDate, transitDays) {
  if (!shipDate) return 'TBD';
  const date = new Date(shipDate);
  date.setDate(date.getDate() + transitDays);
  return date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function BookingPage({ carrier, quoteData, onReset, onBack }) {
  const { quoteRequest, explanation } = quoteData;

  const [form, setForm]           = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          carrierName:   carrier.name,
          carrierPrice:  carrier.priceUSD,
          pickupZip:     quoteRequest.pickupZip,
          deliveryZip:   quoteRequest.deliveryZip,
          vehicleYear:   quoteRequest.vehicleYear,
          vehicleMake:   quoteRequest.vehicleMake,
          vehicleModel:  quoteRequest.vehicleModel,
          transportType: quoteRequest.transportType,
          shipDate:      quoteRequest.shipDate,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const estimatedDelivery = calcDeliveryDate(quoteRequest.shipDate, carrier.transitDays);

  // ── Confirmation screen ──────────────────────────────────
  if (submitted) {
    return (
      <main className="booking-page">
        <div className="confirmation-box">
          <div className="confirmation-icon">✓</div>
          <h2>You're All Set, {form.name.split(' ')[0]}!</h2>
          <p>
            We've received your request for <strong>{carrier.name}</strong> and
            will be in touch within 24 hours to confirm your shipment.
          </p>
          <div className="confirmation-summary">
            <p><strong>Vehicle:</strong> {quoteRequest.vehicleYear} {quoteRequest.vehicleMake} {quoteRequest.vehicleModel}</p>
            <p><strong>Route:</strong> {quoteRequest.pickupZip} → {quoteRequest.deliveryZip}</p>
            <p><strong>Carrier:</strong> {carrier.name}</p>
            <p><strong>Price:</strong> ${carrier.priceUSD.toLocaleString()}</p>
            <p><strong>Est. Delivery:</strong> {estimatedDelivery}</p>
          </div>
          <p className="confirmation-note">No payment is required today.</p>
          <button className="btn-primary" onClick={onReset} style={{ marginTop: '1.5rem' }}>
            Start a New Quote
          </button>
        </div>
      </main>
    );
  }

  // ── Main booking page (two-column on desktop) ────────────
  return (
    <main className="booking-page">

      {/* Page header */}
      <div className="booking-header">
        <p className="booking-back" onClick={onBack}>← Back to results</p>
        <h2>You Selected: {carrier.name}</h2>
        <p className="results-route">
          {quoteRequest.vehicleYear} {quoteRequest.vehicleMake} {quoteRequest.vehicleModel}
          {' — '}
          {quoteRequest.pickupZip} → {quoteRequest.deliveryZip}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="booking-layout">

        {/* ── LEFT: Details ─────────────────────────────── */}
        <div className="booking-details">

          {/* Shipment summary */}
          <div className="booking-section">
            <h3>Shipment Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Vehicle</span>
                <span className="summary-value">{quoteRequest.vehicleYear} {quoteRequest.vehicleMake} {quoteRequest.vehicleModel}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Transport Type</span>
                <span className="summary-value" style={{ textTransform: 'capitalize' }}>{quoteRequest.transportType}</span>
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
                <span className="summary-label">Ship Date</span>
                <span className="summary-value">
                  {new Date(quoteRequest.shipDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Est. Delivery</span>
                <span className="summary-value" style={{ color: '#7c3aed' }}>{estimatedDelivery}</span>
              </div>
            </div>
          </div>

          {/* Carrier details */}
          <div className="booking-section">
            <h3>Carrier Details</h3>
            <div className="carrier-detail-card">
              <div className="carrier-detail-header">
                <span className="carrier-detail-name">{carrier.name}</span>
                <span className="carrier-detail-score">Score: {carrier.score}/100</span>
              </div>
              <div className="carrier-stats">
                <div className="carrier-stat">
                  <span className="stat-icon">⭐</span>
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">{carrier.rating} / 5.0</span>
                </div>
                <div className="carrier-stat">
                  <span className="stat-icon">🕐</span>
                  <span className="stat-label">Transit Time</span>
                  <span className="stat-value">{carrier.transitDays} days</span>
                </div>
                <div className="carrier-stat">
                  <span className="stat-icon">🛡</span>
                  <span className="stat-label">Insurance</span>
                  <span className="stat-value">${carrier.insuranceUSD.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="booking-section">
            <h3>Transparent Pricing</h3>
            <div className="pricing-table">
              <div className="pricing-row">
                <span>Base transport fee</span>
                <span>${carrier.priceUSD.toLocaleString()}</span>
              </div>
              <div className="pricing-row">
                <span>Fuel surcharge</span>
                <span>Included</span>
              </div>
              <div className="pricing-row">
                <span>Cargo insurance (up to ${carrier.insuranceUSD.toLocaleString()})</span>
                <span>Included</span>
              </div>
              <div className="pricing-row">
                <span>Platform fee</span>
                <span>$0</span>
              </div>
              <div className="pricing-row pricing-total">
                <span>Total</span>
                <span>${carrier.priceUSD.toLocaleString()}</span>
              </div>
            </div>
            <div className="trust-signals">
              <span className="trust-badge">✓ No payment required today</span>
              <span className="trust-badge">✓ Free cancellation</span>
            </div>
          </div>

          {/* AI explanation */}
          <div className="ai-explanation">
            <strong>Why We Recommended {carrier.name}</strong>
            <p>{explanation}</p>
          </div>

          <button className="btn-secondary" onClick={onBack}>
            ← Back to All Carriers
          </button>
        </div>

        {/* ── RIGHT: Sticky contact form ────────────────── */}
        <div className="booking-form-column">
          <div className="booking-form-sticky">

            {/* What happens next — above the form */}
            <div className="booking-section">
              <h3>What Happens Next</h3>
              <div className="next-steps">
                <div className="next-step">
                  <span className="next-step-number">1</span>
                  <div>
                    <strong>We confirm with the carrier</strong>
                    <p>We reach out to {carrier.name} to lock in your rate and pickup date.</p>
                  </div>
                </div>
                <div className="next-step">
                  <span className="next-step-number">2</span>
                  <div>
                    <strong>You get a call within 24 hours</strong>
                    <p>An AutoRoute advisor will call you to walk through the details and answer any questions.</p>
                  </div>
                </div>
                <div className="next-step">
                  <span className="next-step-number">3</span>
                  <div>
                    <strong>Your vehicle is picked up</strong>
                    <p>The carrier picks up your vehicle on your ship date and delivers it to {quoteRequest.deliveryZip}.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-section" style={{ marginBottom: 0 }}>
              <h3>Confirm Your Request</h3>

              {/* Price callout */}
              <div className="form-price-callout">
                <span className="form-price-amount">${carrier.priceUSD.toLocaleString()}</span>
                <span className="form-price-label">Total — No payment today</span>
              </div>

              <p style={{ color: '#b0b0c8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Enter your contact info and we'll be in touch within 24 hours.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(555) 555-5555"
                    required
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Request This Carrier'}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default BookingPage;

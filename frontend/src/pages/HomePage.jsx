// ============================================================
// AutoRoute AI — Home Page
// ============================================================
// Full marketing homepage with hero, quote form, how it works,
// why AutoRoute, and footer sections.
// ============================================================

import { useState } from 'react';
import QuoteForm from '../components/QuoteForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function HomePage({ onQuoteResult }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  async function handleFormSubmit(formData) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/quotes`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');

      onQuoteResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Hero + Form (side by side on desktop) ─────────── */}
      <section className="home-hero-section">
        {/* Left: hero copy */}
        <div>
          <span className="hero-eyebrow">AI-Powered Auto Transport</span>
          <h1 className="hero-headline">
            Ship Your Car —<br />
            <span>Without the Guesswork</span>
          </h1>
          <p className="hero-subheadline">
            Enter your route and vehicle details. Our AI compares top carriers
            in seconds and explains exactly why it chose the best one for you.
          </p>
        </div>

        {/* Right: quote form card */}
        <div className="quote-card">
          <p className="quote-card-title">Get Your Free Quote</p>
          <QuoteForm onSubmit={handleFormSubmit} loading={loading} />
          {error && <p className="error-message">Error: {error}</p>}
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="section">
        <p className="section-eyebrow">Simple Process</p>
        <h2 className="section-headline">How It Works</h2>
        <p className="section-sub">
          From quote to carrier selection in under two minutes.
        </p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <p className="step-title">Enter Your Details</p>
            <p className="step-desc">
              Tell us your pickup and delivery locations, vehicle info,
              transport type, and target ship date.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <p className="step-title">AI Compares Carriers</p>
            <p className="step-desc">
              Our AI scores every carrier on price, rating, transit time,
              and insurance — then ranks them for your specific shipment.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <p className="step-title">Pick Your Carrier</p>
            <p className="step-desc">
              Review the ranked results with plain-English explanations,
              select your carrier, and we'll handle the rest.
            </p>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── Why AutoRoute ─────────────────────────────────── */}
      <section className="section">
        <p className="section-eyebrow">Why AutoRoute AI</p>
        <h2 className="section-headline">A Smarter Way to Ship</h2>
        <p className="section-sub">
          No more calling around for quotes. No more confusing contracts.
          Just clear, honest recommendations.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <div>
              <p className="feature-title">AI-Powered Recommendations</p>
              <p className="feature-desc">
                Not just a price list — our AI explains in plain English
                exactly why it chose your top carrier.
              </p>
            </div>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💎</span>
            <div>
              <p className="feature-title">Transparent Pricing</p>
              <p className="feature-desc">
                See the full price breakdown upfront. No hidden fees,
                no surprises when your car arrives.
              </p>
            </div>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🛡</span>
            <div>
              <p className="feature-title">Cargo Insurance Included</p>
              <p className="feature-desc">
                Every carrier we recommend carries federally required
                cargo insurance to protect your vehicle during transit.
              </p>
            </div>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <div>
              <p className="feature-title">Results in Seconds</p>
              <p className="feature-desc">
                No waiting for callbacks. Get ranked carrier options
                and a personalized recommendation instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;

// ============================================================
// AutoRoute AI — Home Page
// ============================================================

import { useState } from 'react';
import QuoteForm from '../components/QuoteForm';
import { SparklesIcon, BanknotesIcon, ShieldCheckIcon, NoSymbolIcon, CreditCardIcon } from '../components/Icons';

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
      {/* ── Hero gradient wrapper (full bleed) ───────────────── */}
      <div className="hero-gradient-wrapper" id="get-a-quote">

        {/* Hero + Form ────────────────────────────────────────── */}
        <section className="home-hero-section">
          <div>
            <span className="hero-eyebrow">AI-Powered Auto Transport</span>
            <h1 className="hero-headline">
              Ship Your Car —<br />
              <span>Without the Runaround</span>
            </h1>
            <p className="hero-subheadline">
              Submit your route once. No sales calls, no hidden fees. Within 24
              business hours you'll receive a graded AI carrier report with our
              recommendation — and a flat $149 fee that's always shown upfront.
            </p>
          </div>

          <div className="quote-card">
            <p className="quote-card-title">Get Your Free Estimate</p>
            <QuoteForm onSubmit={handleFormSubmit} loading={loading} />
            {error && <p className="error-message">Error: {error}</p>}
          </div>
        </section>

        {/* Trust Bar ──────────────────────────────────────────── */}
        <div className="trust-bar">
        <div className="trust-bar-item">
          <BanknotesIcon size={22} className="trust-bar-icon" />
          <div>
            <p className="trust-bar-title">$149 Flat Fee</p>
            <p className="trust-bar-desc">Shown upfront. Always.</p>
          </div>
        </div>
        <div className="trust-bar-item">
          <NoSymbolIcon size={22} className="trust-bar-icon" />
          <div>
            <p className="trust-bar-title">No Sales Calls</p>
            <p className="trust-bar-desc">Submit once, hear back by email.</p>
          </div>
        </div>
        <div className="trust-bar-item">
          <SparklesIcon size={22} className="trust-bar-icon" />
          <div>
            <p className="trust-bar-title">AI Carrier Report</p>
            <p className="trust-bar-desc">Graded comparison, plain English.</p>
          </div>
        </div>
        <div className="trust-bar-item">
          <CreditCardIcon size={22} className="trust-bar-icon" />
          <div>
            <p className="trust-bar-title">No Payment Today</p>
            <p className="trust-bar-desc">Confirm first, pay later.</p>
          </div>
        </div>

      </div>{/* end hero-gradient-wrapper */}

      <hr className="section-divider" />

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="section" id="how-it-works">
        <p className="section-eyebrow">Simple Process</p>
        <h2 className="section-headline">How It Works</h2>
        <p className="section-sub">
          From submission to confirmed carrier in three steps.
        </p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <p className="step-title">Submit Your Route</p>
            <p className="step-desc">
              Enter your pickup and delivery locations, vehicle info, transport
              type, and target ship date. You'll get an instant market-rate
              estimate right away.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <p className="step-title">Receive Your AI Report</p>
            <p className="step-desc">
              We post your shipment to our carrier network and collect bids.
              Within 24 business hours you'll receive a graded carrier comparison
              with a plain-English recommendation.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <p className="step-title">Confirm and We Handle the Rest</p>
            <p className="step-desc">
              Approve your carrier with one click. We lock them in and coordinate
              your pickup — no phone calls, no paperwork, no surprises.
            </p>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── Why AutoRoute ─────────────────────────────────────── */}
      <section className="section">
        <p className="section-eyebrow">Why AutoRoute AI</p>
        <h2 className="section-headline">A Smarter Way to Ship</h2>
        <p className="section-sub">
          No callbacks. No confusion. No hidden fees. Just a clear, honest
          process from start to finish.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <SparklesIcon size={26} className="feature-icon" />
            <div>
              <p className="feature-title">AI Carrier Report</p>
              <p className="feature-desc">
                Every carrier bid is graded on price, rating, transit time, and
                insurance. You get a plain-English explanation of exactly why we
                recommend the carrier we do.
              </p>
            </div>
          </div>
          <div className="feature-card">
            <BanknotesIcon size={26} className="feature-icon" />
            <div>
              <p className="feature-title">Radical Price Transparency</p>
              <p className="feature-desc">
                We charge a flat $149 (open) or $199 (enclosed) broker fee —
                shown separately from the carrier rate. Most brokers hide their
                cut. We don't.
              </p>
            </div>
          </div>
          <div className="feature-card">
            <ShieldCheckIcon size={26} className="feature-icon" />
            <div>
              <p className="feature-title">Vetted Carriers Only</p>
              <p className="feature-desc">
                Every carrier we work with is licensed, insured, and rated by
                real customers. We grade them before we recommend them.
              </p>
            </div>
          </div>
          <div className="feature-card">
            <NoSymbolIcon size={26} className="feature-icon" />
            <div>
              <p className="feature-title">No Phone Calls. Ever.</p>
              <p className="feature-desc">
                Submit once and everything happens by email on your schedule.
                No broker calling five times. No pressure tactics. No voicemails.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;

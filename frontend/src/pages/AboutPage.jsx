// ============================================================
// AutoRoute AI — About Us Page
// ============================================================

function AboutPage() {
  return (
    <main className="about-page">

      {/* ── About ───────────────────────────────────────────── */}
      <section className="about-section">
        <p className="section-eyebrow">Who We Are</p>
        <h2 className="section-headline">Built to Fix a Broken Experience</h2>

        <div className="about-body">
          <p>
            Shipping a car shouldn't be this hard. Most people who need to move a
            vehicle go through the same painful experience: fill out a form online,
            then spend the next two days fielding calls from multiple brokers — each
            quoting a different price with no explanation of how they got there, no
            visibility into what they're actually charging, and no easy way to compare.
          </p>
          <p>
            We built AutoRoute AI to fix that.
          </p>
          <p>
            When you submit a shipment request, we post it to our carrier network and
            collect real bids. Our AI then grades each carrier on price, safety record,
            customer rating, and transit time — and sends you a plain-English report
            explaining exactly why we're recommending the carrier we are. You review
            the report and confirm with one click. We handle everything else.
          </p>
        </div>

        {/* What makes us different */}
        <div className="about-differentiators">
          <h3>What Makes Us Different</h3>
          <ul className="about-list">
            <li>
              <strong>Flat fee, always visible.</strong> We charge $149 on open
              transport ($199 enclosed) — shown upfront, separate from the carrier
              rate. You always know exactly what we make. No hidden markup.
            </li>
            <li>
              <strong>One submission, one point of contact.</strong> We don't sell
              your information to multiple brokers. You submit once, you hear from us.
            </li>
            <li>
              <strong>No phone calls.</strong> Everything happens by email, on your
              schedule. No pressure, no callbacks, no voicemails.
            </li>
            <li>
              <strong>Vetted carriers only.</strong> Every carrier we work with is
              licensed, insured, and rated by real customers. We grade them before
              we recommend them.
            </li>
          </ul>
        </div>

        <div className="about-body">
          <p>
            AutoRoute AI is founder-led and independently operated. We're not a lead
            generation site. We're a brokerage that built better software — because
            the people moving their cars deserved it.
          </p>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── Contact ─────────────────────────────────────────── */}
      <section className="about-section" id="contact">
        <p className="section-eyebrow">Get in Touch</p>
        <h2 className="section-headline">Contact Us</h2>
        <p className="section-sub">
          Questions about your shipment, a quote, or anything else — we're here.
        </p>

        <div className="contact-grid">
          <div className="contact-card">
            <p className="contact-label">Email</p>
            <a className="contact-value" href="mailto:service@autoroute.com">
              service@autoroute.com
            </a>
            <p className="contact-note">We respond within 1 business day.</p>
          </div>
          <div className="contact-card">
            <p className="contact-label">Phone</p>
            <a className="contact-value" href="tel:+15550000000">
              (555) 000-0000
            </a>
            <p className="contact-note">Mon–Fri, 8am–6pm local time.</p>
          </div>
        </div>
      </section>

    </main>
  );
}

export default AboutPage;

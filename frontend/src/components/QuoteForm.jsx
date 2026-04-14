// ============================================================
// AutoRoute AI — Quote Form Component
// ============================================================
// Collects all the information needed to generate a quote:
//   - Pickup and delivery ZIP codes
//   - Vehicle year, make, and model
//   - Transport type (open or enclosed)
//   - Target ship date
// ============================================================

import { useState } from 'react';

function QuoteForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    pickupZip:     '',
    deliveryZip:   '',
    vehicleYear:   '',
    vehicleMake:   '',
    vehicleModel:  '',
    transportType: 'open',
    shipDate:      '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* Route — 2 columns on tablet+, stacks on mobile */}
      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label">Pickup ZIP</label>
          <input
            className="form-input"
            name="pickupZip"
            value={form.pickupZip}
            onChange={handleChange}
            placeholder="e.g. 90210"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Delivery ZIP</label>
          <input
            className="form-input"
            name="deliveryZip"
            value={form.deliveryZip}
            onChange={handleChange}
            placeholder="e.g. 10001"
            required
          />
        </div>
      </div>

      {/* Vehicle — 3 columns on tablet+, stacks on mobile */}
      <div className="form-row-3">
        <div className="form-group">
          <label className="form-label">Year</label>
          <input
            className="form-input"
            name="vehicleYear"
            value={form.vehicleYear}
            onChange={handleChange}
            placeholder="2022"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Make</label>
          <input
            className="form-input"
            name="vehicleMake"
            value={form.vehicleMake}
            onChange={handleChange}
            placeholder="Toyota"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Model</label>
          <input
            className="form-input"
            name="vehicleModel"
            value={form.vehicleModel}
            onChange={handleChange}
            placeholder="Camry"
            required
          />
        </div>
      </div>

      {/* Transport type */}
      <div className="form-group">
        <label className="form-label">Transport Type</label>
        <select
          className="form-select"
          name="transportType"
          value={form.transportType}
          onChange={handleChange}
        >
          <option value="open">Open (standard, most affordable)</option>
          <option value="enclosed">Enclosed (extra protection for luxury/classic cars)</option>
        </select>
      </div>

      {/* Ship date */}
      <div className="form-group">
        <label className="form-label">Target Ship Date</label>
        <input
          className="form-input"
          type="date"
          name="shipDate"
          value={form.shipDate}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Finding best carriers...' : 'Get My Free Quote'}
      </button>

    </form>
  );
}

export default QuoteForm;

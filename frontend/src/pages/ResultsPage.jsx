// ============================================================
// AutoRoute AI — Results Page
// ============================================================
// Displays the AI explanation and ranked carrier list.
// Wider container on desktop, single column on mobile.
// ============================================================

import CarrierCard from '../components/CarrierCard';

function ResultsPage({ quoteData, onReset, onSelectCarrier }) {
  const { rankedCarriers, topCarrier, explanation, quoteRequest } = quoteData;

  return (
    <main className="results-page">
      <div className="results-header">
        <h2>Your Auto Transport Results</h2>
        <p className="results-route">
          {quoteRequest.vehicleYear} {quoteRequest.vehicleMake} {quoteRequest.vehicleModel}
          {' — '}
          {quoteRequest.pickupZip} → {quoteRequest.deliveryZip}
        </p>
      </div>

      {/* AI Recommendation Explanation */}
      <div className="ai-explanation">
        <strong>Our AI Recommendation</strong>
        <p>{explanation}</p>
      </div>

      {/* Ranked Carrier List — click any card to go to booking */}
      <h3 style={{ marginBottom: '1rem' }}>Select a Carrier to Get Started</h3>
      {rankedCarriers.map((carrier, index) => (
        <CarrierCard
          key={carrier.id}
          carrier={carrier}
          rank={index + 1}
          isTop={carrier.id === topCarrier.id}
          onSelect={onSelectCarrier}
        />
      ))}

      <button className="btn-secondary" onClick={onReset}>
        Start Over
      </button>
    </main>
  );
}

export default ResultsPage;

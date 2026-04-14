// ============================================================
// AutoRoute AI — Root App Component
// ============================================================
// Manages which page the user sees: Home, Results, Booking,
// or Admin. The admin page is accessed via /#/admin.
// ============================================================

import { useState } from 'react';
import HomePage    from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import BookingPage from './pages/BookingPage';
import AdminPage   from './pages/AdminPage';

function App() {
  const isAdmin = window.location.hash === '#/admin';

  const [page, setPage]               = useState('home');
  const [quoteData, setQuoteData]     = useState(null);
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  function handleQuoteResult(data) {
    setQuoteData(data);
    setPage('results');
  }

  function handleSelectCarrier(carrier) {
    setSelectedCarrier(carrier);
    setPage('booking');
  }

  function handleBackToResults() {
    setSelectedCarrier(null);
    setPage('results');
  }

  function handleReset() {
    setQuoteData(null);
    setSelectedCarrier(null);
    setPage('home');
  }

  if (isAdmin) {
    return <AdminPage />;
  }

  return (
    <div className="app">
      {page === 'home' && (
        <HomePage onQuoteResult={handleQuoteResult} />
      )}
      {page === 'results' && (
        <ResultsPage
          quoteData={quoteData}
          onReset={handleReset}
          onSelectCarrier={handleSelectCarrier}
        />
      )}
      {page === 'booking' && (
        <BookingPage
          carrier={selectedCarrier}
          quoteData={quoteData}
          onReset={handleReset}
          onBack={handleBackToResults}
        />
      )}
    </div>
  );
}

export default App;

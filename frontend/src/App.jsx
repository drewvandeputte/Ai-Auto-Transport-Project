// ============================================================
// AutoRoute AI — Root App Component
// ============================================================

import { useState } from 'react';
import Navbar             from './components/Navbar';
import Footer             from './components/Footer';
import HomePage           from './pages/HomePage';
import QuoteReceivedPage  from './pages/QuoteReceivedPage';
import ResultsPage        from './pages/ResultsPage';
import BookingPage        from './pages/BookingPage';
import AboutPage          from './pages/AboutPage';
import AdminPage          from './pages/AdminPage';
import ChatWidget         from './components/ChatWidget';

function App() {
  const isAdmin = window.location.hash === '#/admin';

  const [page,            setPage]            = useState('home');
  const [quoteData,       setQuoteData]       = useState(null);
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  function handleQuoteResult(data) {
    setQuoteData(data);
    setPage('submitted');
  }

  function handleViewReport() {
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

  function handleAbout() {
    setPage('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (isAdmin) {
    return (
      <>
        <Navbar onLogoClick={handleReset} onAbout={handleAbout} currentPage="home" />
        <AdminPage />
        <Footer />
        <ChatWidget />
      </>
    );
  }

  return (
    <>
      <Navbar onLogoClick={handleReset} onAbout={handleAbout} currentPage={page} />

      {page === 'home' && (
        <HomePage onQuoteResult={handleQuoteResult} />
      )}
      {page === 'submitted' && (
        <QuoteReceivedPage quoteData={quoteData} onReset={handleReset} />
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
      {page === 'about' && (
        <AboutPage />
      )}

      <Footer />
      <ChatWidget />
    </>
  );
}

export default App;

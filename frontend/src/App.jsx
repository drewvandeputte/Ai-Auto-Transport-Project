// ============================================================
// AutoRoute AI — Root App Component
// ============================================================
// Manages which page the user sees: Home, Results, or Admin.
// The admin page is accessed by visiting /#/admin in the browser.
// ============================================================

import { useState } from 'react';
import HomePage    from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import AdminPage   from './pages/AdminPage';

function App() {
  // Show the admin page if the URL hash is #/admin
  const isAdmin = window.location.hash === '#/admin';

  const [page, setPage]           = useState('home');
  const [quoteData, setQuoteData] = useState(null);

  // Called when the user submits the quote form.
  function handleQuoteResult(data) {
    setQuoteData(data);
    setPage('results');
  }

  // Called when the user clicks "Start Over" on the results page.
  function handleReset() {
    setQuoteData(null);
    setPage('home');
  }

  // Admin view — only shown when URL is /#/admin
  if (isAdmin) {
    return <AdminPage />;
  }

  return (
    <div className="app">
      {page === 'home' && (
        <HomePage onQuoteResult={handleQuoteResult} />
      )}
      {page === 'results' && (
        <ResultsPage quoteData={quoteData} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;

// ============================================================
// AutoRoute AI — Home Page
// ============================================================
// Contains the hero headline and the quote submission form.
// When the form is submitted, it calls the backend API and
// passes results up to App.jsx via the onQuoteResult prop.
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

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      onQuoteResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <h1 className="home-headline">Ship Your Car — Without the Guesswork</h1>
      <p className="home-subheadline">
        Get AI-powered carrier recommendations in seconds. Transparent pricing.
        Plain-English explanations. No hidden fees.
      </p>

      <QuoteForm onSubmit={handleFormSubmit} loading={loading} />

      {error && (
        <p className="error-message">Error: {error}</p>
      )}
    </main>
  );
}

export default HomePage;

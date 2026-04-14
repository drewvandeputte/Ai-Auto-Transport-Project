// ============================================================
// AutoRoute AI — Admin Page
// ============================================================
// Internal view showing all quotes submitted through the
// platform. Accessible at /#/admin in the browser.
// Not linked from the main UI — for internal use only.
// ============================================================

import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AdminPage() {
  const [quotes,  setQuotes]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Fetch all quotes when the page loads
  useEffect(() => {
    async function fetchQuotes() {
      try {
        const response = await fetch(`${API_URL}/api/admin/quotes`);
        const data     = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to load quotes.');

        setQuotes(data.quotes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  if (loading) return <div className="page"><p>Loading quotes...</p></div>;
  if (error)   return <div className="page"><p className="error-message">Error: {error}</p></div>;

  return (
    <main className="page" style={{ maxWidth: '960px' }}>
      <h2>Admin — All Quotes</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        {quotes.length} quote{quotes.length !== 1 ? 's' : ''} submitted so far.
      </p>

      {quotes.length === 0 ? (
        <p>No quotes yet. Submit one from the homepage!</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}>
            <thead>
              <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
                <th style={th}>Date</th>
                <th style={th}>Vehicle</th>
                <th style={th}>Route</th>
                <th style={th}>Type</th>
                <th style={th}>Top Carrier</th>
                <th style={th}>Price</th>
                <th style={th}>Score</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{new Date(q.created_at).toLocaleDateString()}</td>
                  <td style={td}>{q.vehicle_year} {q.vehicle_make} {q.vehicle_model}</td>
                  <td style={td}>{q.pickup_zip} → {q.delivery_zip}</td>
                  <td style={td} style={{ textTransform: 'capitalize' }}>{q.transport_type}</td>
                  <td style={td}>{q.top_carrier_name}</td>
                  <td style={td}>${q.top_carrier_price?.toLocaleString()}</td>
                  <td style={td}>{q.top_carrier_score}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

// Simple reusable cell styles
const th = { padding: '0.6rem 0.75rem', fontWeight: '600' };
const td = { padding: '0.6rem 0.75rem', color: '#333' };

export default AdminPage;

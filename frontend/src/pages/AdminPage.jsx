// ============================================================
// AutoRoute AI — Admin Page
// ============================================================
// Internal view showing all quotes and leads submitted.
// Accessible at /#/admin — not linked from the main UI.
// ============================================================

import { useEffect, useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AdminPage() {
  const [quotes,  setQuotes]  = useState([]);
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tab,     setTab]     = useState('leads'); // 'leads' or 'quotes'
  const [updating, setUpdating] = useState(null);  // lead id currently being updated

  useEffect(() => {
    async function fetchData() {
      try {
        const [quotesRes, leadsRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/quotes`),
          fetch(`${API_URL}/api/admin/leads`),
        ]);

        const quotesData = await quotesRes.json();
        const leadsData  = await leadsRes.json();

        if (!quotesRes.ok) throw new Error(quotesData.error || 'Failed to load quotes.');
        if (!leadsRes.ok)  throw new Error(leadsData.error  || 'Failed to load leads.');

        setQuotes(quotesData.quotes);
        setLeads(leadsData.leads);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleStatusChange(leadId, newStatus) {
    setUpdating(leadId);
    try {
      await fetch(`${API_URL}/api/leads/${leadId}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      });
      // Update local state so the UI reflects the change immediately
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (error)   return <div className="page"><p className="error-message">Error: {error}</p></div>;

  return (
    <main className="page" style={{ maxWidth: '960px' }}>
      <h2>AutoRoute AI — Admin Dashboard</h2>

      {/* Tab switcher */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'leads' ? 'active' : ''}`}
          onClick={() => setTab('leads')}
        >
          Leads ({leads.length})
        </button>
        <button
          className={`admin-tab ${tab === 'quotes' ? 'active' : ''}`}
          onClick={() => setTab('quotes')}
        >
          All Quotes ({quotes.length})
        </button>
      </div>

      {/* Leads table */}
      {tab === 'leads' && (
        <>
          <p style={{ color: '#555', marginBottom: '1rem' }}>
            People who selected a carrier and submitted their contact info.
          </p>
          {leads.length === 0 ? (
            <p>No leads yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
                    <th style={th}>Date</th>
                    <th style={th}>Name</th>
                    <th style={th}>Email</th>
                    <th style={th}>Phone</th>
                    <th style={th}>Vehicle</th>
                    <th style={th}>Route</th>
                    <th style={th}>Carrier</th>
                    <th style={th}>Price</th>
                    <th style={th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={td}>{new Date(l.created_at).toLocaleDateString()}</td>
                      <td style={td}>{l.name}</td>
                      <td style={td}>{l.email}</td>
                      <td style={td}>{l.phone}</td>
                      <td style={td}>{l.vehicle_year} {l.vehicle_make} {l.vehicle_model}</td>
                      <td style={td}>{l.pickup_zip} → {l.delivery_zip}</td>
                      <td style={td}>{l.carrier_name}</td>
                      <td style={td}>${l.carrier_price?.toLocaleString()}</td>
                      <td style={td}>
                        <select
                          value={l.status || 'confirmed'}
                          onChange={e => handleStatusChange(l.id, e.target.value)}
                          disabled={updating === l.id}
                          style={{
                            ...statusSelectStyle,
                            ...statusColors[l.status || 'confirmed'],
                          }}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="contacted">Contacted</option>
                          <option value="booked">Booked</option>
                          <option value="in_transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancellation_requested">Cancel Requested</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Quotes table */}
      {tab === 'quotes' && (
        <>
          <p style={{ color: '#555', marginBottom: '1rem' }}>
            All quote requests submitted through the platform.
          </p>
          {quotes.length === 0 ? (
            <p>No quotes yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
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
        </>
      )}
    </main>
  );
}

const th = { padding: '0.6rem 0.75rem', fontWeight: '600' };
const td = { padding: '0.6rem 0.75rem', color: '#333' };

const statusSelectStyle = {
  border: 'none',
  borderRadius: '12px',
  padding: '0.25rem 0.5rem',
  fontSize: '0.78rem',
  fontWeight: '600',
  cursor: 'pointer',
};

const statusColors = {
  confirmed:               { background: '#dbeafe', color: '#1d4ed8' },
  contacted:               { background: '#fef9c3', color: '#854d0e' },
  booked:                  { background: '#ede9fe', color: '#6d28d9' },
  in_transit:              { background: '#ffedd5', color: '#c2410c' },
  delivered:               { background: '#dcfce7', color: '#15803d' },
  cancellation_requested:  { background: '#fee2e2', color: '#b91c1c' },
  cancelled:               { background: '#f3f4f6', color: '#6b7280' },
};

export default AdminPage;

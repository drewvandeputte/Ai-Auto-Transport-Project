// ============================================================
// AutoRoute AI — Admin Dashboard
// ============================================================
// Internal view showing all leads and quotes.
// Accessible at /#/admin — not linked from the main UI.
// ============================================================

import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const STATUS_LABELS = {
  confirmed:              'Confirmed',
  contacted:              'Contacted',
  booked:                 'Booked',
  in_transit:             'In Transit',
  delivered:              'Delivered',
  cancellation_requested: 'Cancel Requested',
  cancelled:              'Cancelled',
};

const STATUS_COLORS = {
  confirmed:              { background: '#dbeafe', color: '#1e40af' },
  contacted:              { background: '#fef9c3', color: '#854d0e' },
  booked:                 { background: '#ede9fe', color: '#5b21b6' },
  in_transit:             { background: '#ffedd5', color: '#c2410c' },
  delivered:              { background: '#dcfce7', color: '#15803d' },
  cancellation_requested: { background: '#fee2e2', color: '#b91c1c' },
  cancelled:              { background: '#f3f4f6', color: '#6b7280' },
};

function StatusBadge({ status, leadId, onUpdate, updating }) {
  const s = status || 'confirmed';
  return (
    <select
      value={s}
      onChange={e => onUpdate(leadId, e.target.value)}
      disabled={updating === leadId}
      style={{
        ...STATUS_COLORS[s],
        border: 'none',
        borderRadius: '999px',
        padding: '0.25rem 0.6rem',
        fontSize: '0.75rem',
        fontWeight: '700',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
        textAlign: 'center',
        minWidth: '110px',
        opacity: updating === leadId ? 0.5 : 1,
      }}
    >
      {Object.entries(STATUS_LABELS).map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      minWidth: '140px',
    }}>
      <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '2rem', fontWeight: '800', color: color || '#111827', margin: '0.25rem 0 0' }}>{value}</p>
    </div>
  );
}

function AdminPage() {
  const [quotes,   setQuotes]   = useState([]);
  const [leads,    setLeads]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState('leads');
  const [updating, setUpdating] = useState(null);

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
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <div style={page}><p style={{ color: '#6b7280' }}>Loading...</p></div>;
  if (error)   return <div style={page}><p style={{ color: '#dc2626' }}>Error: {error}</p></div>;

  // Summary stats
  const delivered   = leads.filter(l => l.status === 'delivered').length;
  const cancelReqs  = leads.filter(l => l.status === 'cancellation_requested').length;
  const revenue     = leads.filter(l => l.status === 'delivered').reduce((sum, l) => sum + (l.carrier_price * 0.175 || 0), 0);

  return (
    <div style={page}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: '0 0 0.25rem' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
          AutoRoute AI — internal use only
        </p>
      </div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <StatCard label="Total Leads"    value={leads.length}          color="#111827" />
        <StatCard label="Total Quotes"   value={quotes.length}         color="#111827" />
        <StatCard label="Delivered"      value={delivered}             color="#15803d" />
        <StatCard label="Cancel Requests" value={cancelReqs}           color="#b91c1c" />
        <StatCard label="Est. Revenue"   value={`$${Math.round(revenue).toLocaleString()}`} color="#5b21b6" />
      </div>

      {/* ── Tab switcher ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0' }}>
        {[['leads', `Leads (${leads.length})`], ['quotes', `All Quotes (${quotes.length})`]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.6rem 1.25rem',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderBottom: tab === key ? '2px solid #6d28d9' : '2px solid transparent',
              color: tab === key ? '#6d28d9' : '#6b7280',
              marginBottom: '-2px',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Leads table ─────────────────────────────────────── */}
      {tab === 'leads' && (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          {leads.length === 0 ? (
            <p style={{ padding: '2rem', color: '#6b7280', textAlign: 'center' }}>No leads yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
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
                {leads.map((l, i) => (
                  <tr key={l.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <td style={td}>{new Date(l.created_at).toLocaleDateString()}</td>
                    <td style={{ ...td, fontWeight: '600', color: '#111827' }}>{l.name}</td>
                    <td style={td}>{l.email}</td>
                    <td style={td}>{l.phone}</td>
                    <td style={td}>{l.vehicle_year} {l.vehicle_make} {l.vehicle_model}</td>
                    <td style={td}>{l.pickup_zip} → {l.delivery_zip}</td>
                    <td style={td}>{l.carrier_name}</td>
                    <td style={{ ...td, fontWeight: '600', color: '#111827' }}>${l.carrier_price?.toLocaleString()}</td>
                    <td style={td}>
                      <StatusBadge
                        status={l.status}
                        leadId={l.id}
                        onUpdate={handleStatusChange}
                        updating={updating}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Quotes table ────────────────────────────────────── */}
      {tab === 'quotes' && (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          {quotes.length === 0 ? (
            <p style={{ padding: '2rem', color: '#6b7280', textAlign: 'center' }}>No quotes yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={th}>Date</th>
                  <th style={th}>Vehicle</th>
                  <th style={th}>Route</th>
                  <th style={th}>Type</th>
                  <th style={th}>Top Carrier</th>
                  <th style={th}>Price</th>
                  <th style={th}>AI Score</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q, i) => (
                  <tr key={q.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <td style={td}>{new Date(q.created_at).toLocaleDateString()}</td>
                    <td style={{ ...td, fontWeight: '600', color: '#111827' }}>{q.vehicle_year} {q.vehicle_make} {q.vehicle_model}</td>
                    <td style={td}>{q.pickup_zip} → {q.delivery_zip}</td>
                    <td style={{ ...td, textTransform: 'capitalize' }}>{q.transport_type}</td>
                    <td style={td}>{q.top_carrier_name}</td>
                    <td style={{ ...td, fontWeight: '600', color: '#111827' }}>${q.top_carrier_price?.toLocaleString()}</td>
                    <td style={td}>
                      <span style={{
                        background: '#ede9fe',
                        color: '#5b21b6',
                        borderRadius: '999px',
                        padding: '0.2rem 0.6rem',
                        fontWeight: '700',
                        fontSize: '0.78rem',
                      }}>
                        {q.top_carrier_score}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}

const page = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
  background: '#f3f4f6',
  minHeight: '100vh',
  fontFamily: 'inherit',
};

const th = {
  padding: '0.75rem 1rem',
  fontWeight: '700',
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: '#6b7280',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const td = {
  padding: '0.75rem 1rem',
  color: '#374151',
  whiteSpace: 'nowrap',
};

export default AdminPage;

import { useState, useEffect } from 'react';
import { getAllApplications, processApplicationDecision } from '../services/applicationService';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try { setApplications(await getAllApplications()); } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleStatusUpdate = async (app, status) => {
    setActionLoading(app.id);
    try {
      await processApplicationDecision(app.id, status, app);
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status } : a));
      setToast({ type: 'success', message: `Application ${status}!` });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: 'Action failed.' });
      setTimeout(() => setToast(null), 3000);
    }
    setActionLoading(null);
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);
  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loading-spinner" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: '100px', right: '24px', padding: '14px 24px',
          borderRadius: '14px', fontWeight: 700, zIndex: 1000,
          background: toast.type === 'success' ? '#A78BFA' : '#ef4444',
          color: toast.type === 'success' ? '#000' : '#fff',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)',
          animation: 'slide-up 0.3s ease-out',
        }}>
          {toast.message}
        </div>
      )}

      <div className="sc-container">
        {/* Header & Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px', color: '#A78BFA' }}>
              Recruitment Desk
            </h1>
            <p style={{ color: '#94a3b8' }}>Manage incoming applications</p>
          </div>
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(8,8,12,0.8)', padding: '6px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px',
                transition: 'all 0.2s',
                background: filter === f ? '#A78BFA' : 'transparent',
                color: filter === f ? '#000' : 'rgba(255,255,255,0.35)',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Pipeline', count: counts.all },
            { label: 'Reviewing', count: counts.pending },
            { label: 'Accepted', count: counts.approved },
            { label: 'Declined', count: counts.rejected },
          ].map(s => (
            <div key={s.label} className="sc-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '2rem', fontWeight: 800, color: '#A78BFA' }}>{s.count}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Applications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div className="sc-card" style={{ padding: '60px', textAlign: 'center', opacity: 0.4 }}>
              <p style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 700, letterSpacing: '2px' }}>No applications in this queue</p>
            </div>
          ) : filtered.map(app => (
            <div key={app.id} className="sc-card" style={{ border: expandedId === app.id ? '1px solid rgba(167,139,250,0.3)' : undefined }}>
              <div
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                style={{ padding: '20px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Orbitron", sans-serif', fontWeight: 800, color: '#A78BFA',
                  }}>
                    {app.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{app.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Discord: {app.discordId}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{
                    padding: '4px 14px', borderRadius: '20px', fontSize: '0.65rem',
                    fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px',
                    background: app.status === 'approved' ? 'rgba(167,139,250,0.1)' : app.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(167,139,250,0.08)',
                    color: app.status === 'approved' ? '#A78BFA' : app.status === 'rejected' ? '#ef4444' : '#A78BFA',
                    border: `1px solid ${app.status === 'rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(167,139,250,0.15)'}`,
                  }}>
                    {app.status}
                  </span>
                  <span style={{ transition: 'transform 0.3s', transform: expandedId === app.id ? 'rotate(180deg)' : 'none', color: '#94a3b8' }}>▼</span>
                </div>
              </div>

              {expandedId === app.id && (
                <div style={{ padding: '28px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(167,139,250,0.01)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '2px', marginBottom: '6px', textTransform: 'uppercase' }}>Age</div>
                      <div style={{ fontWeight: 700 }}>{app.age}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '2px', marginBottom: '6px', textTransform: 'uppercase' }}>Experience</div>
                      <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{app.rpExperience}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>Scenario</div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, fontStyle: 'italic' }}>"{app.scenarioAnswer}"</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', marginBottom: '28px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#A78BFA', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>Backstory</div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{app.characterBackstory}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => handleStatusUpdate(app, 'approved')} disabled={actionLoading === app.id} className="sc-btn" style={{ flex: 1 }}>
                      {actionLoading === app.id ? 'Processing...' : '✓ Approve'}
                    </button>
                    <button onClick={() => handleStatusUpdate(app, 'rejected')} disabled={actionLoading === app.id} className="sc-btn-outline" style={{ flex: 1, borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
                      {actionLoading === app.id ? 'Processing...' : '✕ Reject'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

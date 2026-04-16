import { useState, useEffect } from 'react';
import { getAllApplications, processApplicationDecision, deleteApplications } from '../services/applicationService';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;
    setActionLoading(id);
    try {
      await deleteApplications([id]);
      setApplications(prev => prev.filter(a => a.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setToast({ type: 'success', message: 'Application deleted.' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: 'Delete failed.' });
      setTimeout(() => setToast(null), 3000);
    }
    setActionLoading(null);
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (!window.confirm(`Are you sure you want to delete ${ids.length} applications? This action cannot be undone.`)) return;
    setLoading(true);
    try {
      await deleteApplications(ids);
      setApplications(prev => prev.filter(a => !selectedIds.has(a.id)));
      setSelectedIds(new Set());
      setToast({ type: 'success', message: `${ids.length} applications deleted.` });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: 'Bulk delete failed.' });
      setTimeout(() => setToast(null), 3000);
    }
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(a => a.id)));
    }
  };

  const filtered = applications.filter(a => {
    const matchesStatus = filter === 'all' || a.status === filter;
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const typeColors = {
    civilian: '#A78BFA',
    police: '#3B82F6',
    ems: '#EF4444',
    mechanic: '#F59E0B'
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

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(8,8,12,0.95)', border: '1px solid rgba(167,139,250,0.3)',
          padding: '16px 32px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '24px',
          zIndex: 1000, boxShadow: '0 10px 40px rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)',
          animation: 'slide-up 0.3s ease-out'
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#A78BFA' }}>{selectedIds.size} Selected</span>
          <button onClick={handleBulkDelete} className="sc-btn" style={{ padding: '8px 20px', fontSize: '0.7rem', background: '#ef4444', color: '#fff', boxShadow: 'none' }}>
            Delete Selected
          </button>
          <button onClick={() => setSelectedIds(new Set())} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Cancel
          </button>
        </div>
      )}


      <div className="sc-container">
        {/* Header & Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', color: '#A78BFA' }}>
              Recruitment <span style={{ color: '#fff' }}>Desk</span>
            </h1>
            <p style={{ color: '#94a3b8' }}>Review and manage portal applications</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
            {/* Status Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(8,8,12,0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px',
                  transition: 'all 0.2s',
                  background: filter === f ? '#A78BFA' : 'transparent',
                  color: filter === f ? '#000' : 'rgba(255,255,255,0.3)',
                }}>
                  {f}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={toggleSelectAll}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: '#fff', padding: '8px 12px', fontSize: '0.65rem',
                  fontWeight: 700, cursor: 'pointer'
                }}
              >
                {selectedIds.size === filtered.length && filtered.length > 0 ? 'Unselect All' : 'Select All Filtered'}
              </button>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(167,139,250,0.1)',
                  borderRadius: '10px', color: '#A78BFA', padding: '8px 12px',
                  fontSize: '0.75rem', fontWeight: 700, outline: 'none'
                }}
              >
                <option value="all">All Departments</option>
                <option value="civilian">Civilian</option>
                <option value="police">Police Dept</option>
                <option value="ems">EMS</option>
                <option value="mechanic">Mechanic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div className="sc-card" style={{ padding: '80px', textAlign: 'center', opacity: 0.3 }}>
              <p style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 700, letterSpacing: '2px' }}>Queue is empty</p>
            </div>
          ) : filtered.map(app => (
            <div key={app.id} className="sc-card" style={{ border: selectedIds.has(app.id) ? '1px solid #A78BFA' : expandedId === app.id ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(255,255,255,0.02)' }}>
              <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Checkbox */}
                  <div 
                    onClick={() => toggleSelect(app.id)}
                    style={{ 
                      width: '20px', height: '20px', borderRadius: '6px', 
                      border: '2px solid rgba(167,139,250,0.3)', cursor: 'pointer',
                      background: selectedIds.has(app.id) ? '#A78BFA' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                    }}
                  >
                    {selectedIds.has(app.id) && <span style={{ color: '#000', fontSize: '12px', fontWeight: 900 }}>✓</span>}
                  </div>

                  <div 
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }}
                  >
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: '"Orbitron", sans-serif', fontWeight: 900, color: '#A78BFA',
                      fontSize: '1.2rem'
                    }}>
                      {app.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '2px' }}>{app.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Discord: {app.discordId}</span>
                         <span style={{ 
                           fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px', 
                           background: `${typeColors[app.type]}20`, color: typeColors[app.type],
                           border: `1px solid ${typeColors[app.type]}40`, fontWeight: 900, textTransform: 'uppercase'
                         }}>{app.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{
                    padding: '6px 16px', borderRadius: '20px', fontSize: '0.65rem',
                    fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px',
                    background: app.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(167, 139, 250, 0.1)',
                    color: app.status === 'approved' ? '#10b981' : app.status === 'rejected' ? '#ef4444' : '#A78BFA',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    {app.status}
                  </span>
                  
                  <button 
                    onClick={() => handleDelete(app.id)}
                    disabled={actionLoading === app.id}
                    title="Delete Submission"
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '8px', borderRadius: '8px', color: '#ef4444', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                  </button>

                  <span 
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    style={{ transition: 'transform 0.3s', transform: expandedId === app.id ? 'rotate(180deg)' : 'none', color: '#475569', cursor: 'pointer' }}
                  >▼</span>
                </div>
              </div>

              {expandedId === app.id && (
                <div style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#A78BFA', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>Age</div>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{app.age}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#A78BFA', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>RP Experience</div>
                      <div style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>{app.rpExperience}</div>
                    </div>
                  </div>

                  {app.departmentReason && (
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.02)' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: typeColors[app.type], letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>Reason for Joining {app.type.toUpperCase()}</div>
                      <div style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.7 }}>{app.departmentReason}</div>
                    </div>
                  )}

                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#A78BFA', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>Scenario Response</div>
                    <div style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.7, fontStyle: 'italic' }}>"{app.scenarioAnswer}"</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#A78BFA', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>Backstory</div>
                    <div style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{app.characterBackstory}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={() => handleStatusUpdate(app, 'approved')} disabled={actionLoading === app.id} className="sc-btn" style={{ flex: 1, padding: '16px' }}>
                      {actionLoading === app.id ? 'Processing...' : '✓ Approve Application'}
                    </button>
                    <button onClick={() => handleStatusUpdate(app, 'rejected')} disabled={actionLoading === app.id} className="sc-btn-outline" style={{ flex: 1, borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444', padding: '16px' }}>
                      {actionLoading === app.id ? 'Processing...' : '✕ Reject Application'}
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

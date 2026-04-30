import { useState, useEffect } from 'react';
import { fetchServerStatus } from '../services/txAdminService';

const ServerStatus = () => {
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  const SERVER_ID = '4gblo45';
  const JOIN_LINK = `https://cfx.re/join/${SERVER_ID}`;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await fetchServerStatus();
        if (data.success) {
          setServerData({
            hostname: data.hostname,
            clients: data.players,
            sv_maxclients: data.maxPlayers,
            gametype: data.gametype,
            mapname: data.mapname,
            uptime: data.uptime,
            ping: data.ping,
            online: data.online,
            queue: data.queue,
            discordMembers: data.discordMembers,
            staffOnline: data.staffOnline
          });
        } else {
          throw new Error('Server unreachable');
        }
      } catch (err) {
        console.error('Failed to fetch server status:', err);
        setServerData({
          hostname: 'Dream City Roleplay | Season 2',
          clients: 0,
          sv_maxclients: 48,
          gametype: 'Roleplay',
          mapname: 'Los Santos',
          uptime: 'Offline',
          ping: 'N/A',
          online: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(`connect cfx.re/join/${SERVER_ID}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const isOnline = serverData?.online !== false;
  const statusColor = isOnline ? '#10b981' : '#ef4444';

  const metrics = [
    { label: 'STATUS', value: isOnline ? 'Online' : 'Offline', icon: isOnline ? '🟢' : '🔴', color: statusColor },
    { label: 'PLAYERS', value: `${serverData?.clients || 0}/${serverData?.sv_maxclients || 48}`, icon: '👥', color: '#A78BFA' },
    { label: 'UPTIME', value: serverData?.uptime || 'Online', icon: '🕒', color: '#3b82f6' },
    { label: 'GAME', value: serverData?.gametype || 'Roleplay', icon: '🎮', color: '#f59e0b' }
  ];

  return (
    <div style={{ padding: '60px 0', borderTop: '1px solid rgba(167, 139, 250, 0.06)' }}>
      <div className="sc-container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#fff',
            marginBottom: '8px'
          }}>
            Server <span style={{ color: '#A78BFA' }}>Status</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>
            Live FiveM Connection Details
          </p>
        </div>

        <div className="sc-card" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: statusColor,
                boxShadow: `0 0 15px ${statusColor}`,
                animation: isOnline ? 'pulse-cyan 2s ease-in-out infinite' : 'none'
              }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginBottom: '4px', textTransform: 'uppercase' }}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{serverData?.hostname?.substring(0, 50) || 'DCRP - Los Santos'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleCopyIp}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '12px 24px', color: '#fff', fontSize: '0.75rem',
                  fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px',
                  display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#A78BFA'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                {copySuccess ? 'COPIED!' : 'COPY ID'}
              </button>
              <a
                href={JOIN_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="sc-btn"
                style={{ padding: '12px 32px', fontSize: '0.75rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '4px' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                JOIN NOW
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {metrics.map((m, i) => (
            <div key={i} className="sc-card" style={{ padding: '24px', borderLeft: `4px solid ${m.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', letterSpacing: '2px' }}>{m.label}</span>
                <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: m.color }}>{loading ? '...' : m.value}</div>
            </div>
          ))}
        </div>

        <div className="sc-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.2rem' }}>📋</span>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '2px' }}>Server Info</h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Hostname</span>
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, textAlign: 'right', maxWidth: '70%' }}>{serverData?.hostname || 'Dream City Roleplay'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Map Name</span>
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800 }}>{serverData?.mapname || 'Los Santos'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Join Link</span>
              <span style={{ color: '#A78BFA', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px' }}>CONNECT CFX.RE/JOIN/{SERVER_ID}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerStatus;

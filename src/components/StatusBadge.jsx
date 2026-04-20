// StatusBadge Component — color-coded status indicator
// Displays pending (gold), approved (green), or rejected (red) status

/**
 * @param {Object} props
 * @param {'pending'|'approved'|'rejected'} props.status - Application status
 */
const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      label: '⏳ Pending',
      bg: 'rgba(245, 166, 35, 0.12)',
      border: 'rgba(245, 166, 35, 0.3)',
      color: '#f5a623',
      glow: '0 0 15px rgba(245, 166, 35, 0.2)',
      pulse: true
    },
    approved: {
      label: '✅ Approved',
      bg: 'rgba(0, 209, 94, 0.12)',
      border: 'rgba(0, 209, 94, 0.3)',
      color: '#00d15e',
      glow: '0 0 15px rgba(0, 209, 94, 0.2)',
    },
    rejected: {
      label: '❌ Rejected',
      bg: 'rgba(220, 38, 38, 0.12)',
      border: 'rgba(220, 38, 38, 0.3)',
      color: '#dc2626',
      glow: '0 0 15px rgba(220, 38, 38, 0.2)',
    },
    scheduled: {
      label: '🗓️ Scheduled',
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.3)',
      color: '#06b6d4',
      glow: '0 0 15px rgba(6, 182, 212, 0.2)',
      pulse: true
    }
  };

  const style = config[status] || config.pending;

  return (
    <span
      className={style.pulse ? 'animate-pulse' : ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 18px',
        borderRadius: '30px',
        fontSize: '0.82rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        boxShadow: style.glow,
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(4px)'
      }}
      id={`status-badge-${status}`}
    >
      <span style={{ 
        marginRight: '8px',
        fontSize: '1rem' 
      }}>
        {style.label.split(' ')[0]}
      </span>
      {style.label.split(' ')[1]}
    </span>
  );
};

export default StatusBadge;

const CarAnimation = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '15px',
      left: 0,
      width: '100%',
      height: '60px',
      pointerEvents: 'none',
      zIndex: 5,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '180px',
        animation: 'drive 22s linear infinite',
      }}>
        {/* High-Fidelity SVG Sports Car - 100% Transparent */}
        <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
          width: '100%',
          filter: 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.6))'
        }}>
          {/* Main Body - Sleek Aero Profile */}
          <path 
            d="M5 32 L5 30 Q5 28 10 26 L22 22 Q35 15 55 15 L85 15 Q100 15 110 22 L115 28 Q118 30 118 32 L118 35 L5 35 Z" 
            fill="rgba(15, 15, 20, 0.85)" 
            stroke="#A78BFA" 
            strokeWidth="0.8"
          />
          
          {/* Body Lines - Neon Accents */}
          <path d="M22 23 Q40 18 60 18 L90 18" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="0.5" />
          <path d="M10 28 L110 28" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="0.5" />
          
          {/* Windows / Greenhouse */}
          <path 
            d="M30 22 L55 17 L80 17 L95 22 Z" 
            fill="rgba(167, 139, 250, 0.2)" 
            stroke="rgba(167, 139, 250, 0.5)" 
            strokeWidth="0.5"
          />
          <path d="M58 17 L58 22" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="0.3" />
          
          {/* Headlights - Cyan Glow */}
          <path d="M105 23 L112 26 L112 28 L103 26 Z" fill="#22d3ee" style={{ filter: 'blur(1px)' }} />
          <path d="M112 25 L118 28" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" style={{ filter: 'blur(2px)' }} />
          
          {/* Taillights - Red Glow */}
          <path d="M5 28 L12 28 L12 30 L5 30 Z" fill="#ef4444" style={{ filter: 'blur(1px)' }} />
          
          {/* Wheels - Tech Design */}
          <circle cx="28" cy="34" r="5" fill="#000" stroke="#A78BFA" strokeWidth="0.8" />
          <circle cx="28" cy="34" r="2.5" stroke="rgba(167, 139, 250, 0.5)" strokeWidth="0.5" />
          
          <circle cx="92" cy="34" r="5" fill="#000" stroke="#A78BFA" strokeWidth="0.8" />
          <circle cx="92" cy="34" r="2.5" stroke="rgba(167, 139, 250, 0.5)" strokeWidth="0.5" />
          
          {/* Ground Glow Shadow */}
          <rect x="15" y="38" width="80" height="1" fill="rgba(167, 139, 250, 0.3)" style={{ filter: 'blur(3px)' }} />
        </svg>
      </div>

      <style>{`
        @keyframes drive {
          from {
            transform: translateX(-250px);
          }
          to {
            transform: translateX(calc(100vw + 250px));
          }
        }
      `}</style>
    </div>
  );
};

export default CarAnimation;

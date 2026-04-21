const CarAnimation = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: 0,
      width: '100%',
      height: '60px',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
      opacity: 0.4
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        whiteSpace: 'nowrap',
        animation: 'drive 25s linear infinite',
      }}>
        <svg 
          width="120" 
          height="40" 
          viewBox="0 0 120 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Car Body */}
          <path 
            d="M5 30 L10 20 L25 15 L80 15 L95 18 L115 30 L115 35 L5 35 Z" 
            fill="rgba(167, 139, 250, 0.1)" 
            stroke="#A78BFA" 
            strokeWidth="1.5"
          />
          {/* Windows */}
          <path 
            d="M28 18 L50 18 L50 25 L25 25 Z" 
            fill="rgba(167, 139, 250, 0.3)" 
          />
          <path 
            d="M55 18 L75 18 L82 25 L55 25 Z" 
            fill="rgba(167, 139, 250, 0.3)" 
          />
          {/* Wheels */}
          <circle cx="25" cy="35" r="5" fill="#000" stroke="#A78BFA" strokeWidth="1" />
          <circle cx="95" cy="35" r="5" fill="#000" stroke="#A78BFA" strokeWidth="1" />
          {/* Glowing Lights */}
          <rect x="110" y="28" width="5" height="3" fill="#A78BFA" style={{ filter: 'blur(2px)' }} />
          <rect x="2" y="28" width="5" height="3" fill="#ff4444" style={{ filter: 'blur(2px)' }} />
        </svg>
      </div>

      <style>{`
        @keyframes drive {
          from {
            transform: translateX(-150px);
          }
          to {
            transform: translateX(calc(100vw + 150px));
          }
        }
      `}</style>
    </div>
  );
};

export default CarAnimation;

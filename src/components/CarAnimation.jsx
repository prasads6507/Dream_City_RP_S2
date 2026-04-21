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
        width: '180px',
        animation: 'drive 22s linear infinite',
      }}>
        <img 
          src="/images/neon-car.png" 
          alt="Sports Car" 
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            mixBlendMode: 'screen', // Ensures absolute black blends perfectly
            filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.4))'
          }}
        />
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

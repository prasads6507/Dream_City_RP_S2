const CarAnimation = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: 0,
      width: '100%',
      height: '60px',
      pointerEvents: 'none',
      zIndex: 5,
      overflow: 'hidden',
      opacity: 1.0
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '250px',
        animation: 'drive 18s linear infinite',
      }}>
        <img 
          src="/images/neon-car.png" 
          alt="Sports Car" 
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            mixBlendMode: 'screen', // Ensures absolute black blends perfectly
            filter: 'drop-shadow(0 0 15px rgba(167, 139, 250, 0.8))'
          }}
        />
      </div>

      <style>{`
        @keyframes drive {
          from {
            transform: translateX(-400px);
          }
          to {
            transform: translateX(calc(100vw + 400px));
          }
        }
      `}</style>
    </div>
  );
};

export default CarAnimation;

import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setFadeOut(true), 500);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: fadeOut ? 0 : 1,
      pointerEvents: fadeOut ? 'none' : 'auto',
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'rgba(167, 139, 250, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        animation: 'pulse 2s ease-in-out infinite alternate',
      }} />

      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        width: '100%',
        maxWidth: '400px',
        padding: '0 20px',
      }}>
        {/* Logo */}
        <img 
          src="/images/logo.png" 
          alt="Dream City Roleplay" 
          style={{
            width: '240px',
            height: 'auto',
            animation: 'logo-float 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 20px rgba(167, 139, 250, 0.3))',
          }}
        />

        {/* Loading Container */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.03)',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #A78BFA, #c4b5fd)',
              boxShadow: '0 0 15px rgba(167, 139, 250, 0.5)',
              transition: 'width 0.1s ease-out',
            }} />
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '2px',
            color: 'rgba(255, 255, 255, 0.4)',
            textTransform: 'uppercase',
            fontWeight: 800
          }}>
            <span>Initializing City</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          from { transform: scale(1); opacity: 0.5; }
          to { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default Preloader;

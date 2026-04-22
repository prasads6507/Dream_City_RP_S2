import React from 'react';

const DiscordLoading = ({ title = "Discord", message = "Please wait while we establish a secure connection to your Discord account..." }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-out',
    }}>
      <div style={{
        padding: '60px',
        borderRadius: '24px',
        background: 'rgba(15, 15, 20, 0.8)',
        border: '1px solid rgba(167, 139, 250, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
      }}>
        <div style={{
          position: 'relative',
          width: '80px',
          height: '80px',
        }}>
          {/* Branded Spinner */}
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '4px solid rgba(167, 139, 250, 0.1)',
            borderTop: '4px solid #A78BFA',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#A78BFA',
          }}>
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.5rem', marginBottom: '8px', color: '#fff' }}>
            {title} <span style={{ color: '#A78BFA' }}>Auth</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {message}
          </p>
        </div>

        <div style={{
          width: '100%',
          height: '2px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginTop: '8px',
        }}>
          <div style={{
            height: '100%',
            width: '100%',
            background: '#A78BFA',
            animation: 'loading-slide 2s infinite ease-in-out',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes loading-slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default DiscordLoading;

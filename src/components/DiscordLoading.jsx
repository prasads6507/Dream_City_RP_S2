import React from 'react';

const DiscordLoading = () => {
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
          {/* Discord Icon Spinner */}
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
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.09 14.09 0 001.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128a10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01a13.98 13.98 0 0012.084 0a.074.074 0 01.078.01a10.122 10.122 0 00.372.292a.077.077 0 01-.007.128a12.253 12.253 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.082.082 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.966 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.5rem', marginBottom: '8px', color: '#fff' }}>
            Discord <span style={{ color: '#A78BFA' }}>Auth</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Please wait while we establish a secure connection to your Discord account...
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

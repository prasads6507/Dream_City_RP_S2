import { Link } from 'react-router-dom';

const Store = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'transparent',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: 0,
      }} />

      <div className="sc-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 20px',
          borderRadius: '50px',
          background: 'rgba(167, 139, 250, 0.08)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          marginBottom: '32px',
          animation: 'fade-in 0.8s ease-out both',
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%', background: '#A78BFA',
            boxShadow: '0 0 10px #A78BFA',
            animation: 'pulse-cyan 2s ease-in-out infinite',
          }} />
          <span style={{ color: '#A78BFA', fontFamily: '"Orbitron", sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
            Store
          </span>
        </div>

        <h1 style={{
          fontFamily: '"Outfit", sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '24px',
          color: '#fff',
          animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both',
        }}>
          Memberships are <br />
          <span style={{ color: '#A78BFA' }}>coming Soon.....</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          lineHeight: 1.8,
          maxWidth: '600px',
          margin: '0 auto 40px',
          animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both',
        }}>
          We are working hard to bring you the best roleplay experience with exclusive perks and benefits. Stay tuned for further updates!
        </p>

        <div style={{
          animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both',
        }}>
          <Link to="/" className="sc-btn">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Grid Pattern Background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#A78BFA 1px, transparent 1px), linear-gradient(90deg, #A78BFA 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        zIndex: 0
      }} />
    </div>
  );
};

export default Store;

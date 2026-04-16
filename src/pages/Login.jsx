import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn, getUserData } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, userData, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!authLoading && currentUser && userData) {
      if (userData.role === 'admin') navigate('/admin');
      else setError('Unauthorized: Admin credentials required.');
    }
  }, [currentUser, userData, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signIn(email, password);
      const data = await getUserData(cred.user.uid);
      if (data?.role === 'admin') navigate('/admin');
      else throw new Error('Access Denied. Admin role required.');
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px',
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(167, 139, 250, 0.1)',
    borderRadius: '14px', color: '#fff',
    fontSize: '0.95rem', fontFamily: '"Inter", sans-serif',
    outline: 'none', transition: 'all 0.3s ease',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '500px', height: '500px', background: 'rgba(167, 139, 250, 0.04)',
        filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="sc-card" style={{ width: '100%', maxWidth: '420px', padding: '48px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '56px', height: '56px', margin: '0 auto 20px',
            background: '#A78BFA', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 25px rgba(167, 139, 250, 0.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          <h1 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>
            Staff <span style={{ color: '#A78BFA' }}>Access</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Secure Entry
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: '"Orbitron", sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@dreamcityrp.com" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#A78BFA'; e.target.style.boxShadow = '0 0 15px rgba(167,139,250,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(167,139,250,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: '"Orbitron", sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Password
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#A78BFA'; e.target.style.boxShadow = '0 0 15px rgba(167,139,250,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(167,139,250,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <button type="submit" className="sc-btn" disabled={loading} style={{ width: '100%', marginBottom: '16px' }}>
            {loading ? 'Authenticating...' : 'Access Panel'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
        </div>

        <button 
          onClick={async () => {
            setLoading(true);
            setError('');
            try {
              const { signInWithDiscord } = await import('../services/authService');
              await signInWithDiscord();
            } catch (err) {
              setError(err.message || 'Discord login failed.');
            } finally {
              setLoading(false);
            }
          }} 
          disabled={loading} 
          className="sc-btn-outline" 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01a13.98 13.98 0 0 0 12.084 0a.074.074 0 0 1 .078.01a10.122 10.122 0 0 0 .372.292a.077.077 0 0 1-.007.128a12.253.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.082.082 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.966 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/></svg>
          Admin Discord Login
        </button>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Dream City
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

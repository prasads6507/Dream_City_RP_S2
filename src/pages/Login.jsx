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

  // All staff roles that can access the dashboard
  const STAFF_ROLES = ['admin', 'police', 'ems', 'mechanic'];

  useEffect(() => {
    if (!authLoading && currentUser && userData) {
      if (STAFF_ROLES.includes(userData.role)) navigate('/admin');
      else setError('Unauthorized: Staff credentials required.');
    }
  }, [currentUser, userData, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signIn(email, password);
      const data = await getUserData(cred.user.uid);
      if (STAFF_ROLES.includes(data?.role)) navigate('/admin');
      else throw new Error('Access Denied. Staff role required.');
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

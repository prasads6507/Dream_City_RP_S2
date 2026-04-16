import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithDiscord } from '../services/authService';
import { submitApplication, checkDiscordDuplicate } from '../services/applicationService';

const Apply = () => {
  const { currentUser, userData, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('selection'); // selection, form
  const [appType, setAppType] = useState(null);
  const [step, setStep] = useState(1);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    discordId: '',
    rpExperience: '',
    departmentReason: '', // Why join PD/EMS/etc
    scenarioAnswer: '',
    characterBackstory: '',
  });

  // Prefill when user data is available
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        fullName: userData.name || '',
        discordId: userData.discordUsername || userData.discordId || '',
      }));
    }
  }, [userData]);

  const departments = [
    { id: 'civilian', label: 'Civilian', icon: '🏙️', color: '#A78BFA' },
    { id: 'police', label: 'Police Department', icon: '🚔', color: '#3B82F6' },
    { id: 'ems', label: 'EMS', icon: '🚑', color: '#EF4444' },
    { id: 'mechanic', label: 'Mechanic', icon: '🔧', color: '#F59E0B' },
  ];

  const handleDiscordLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithDiscord();
    } catch (err) {
      setError('Discord login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startApplication = (type) => {
    setAppType(type);
    setView('form');
    setStep(1);
  };

  const validateStep = (s) => {
    setError('');
    if (s === 1) {
      if (!formData.fullName.trim()) { setError('Name is required'); return false; }
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 15) { setError('Minimum age for application is 15.'); return false; }
      if (appType !== 'civilian' && !formData.departmentReason.trim()) { 
        setError('Please explain why you want to join this department.'); return false; 
      }
    } else if (s === 2) {
      if (formData.scenarioAnswer.trim().length < 50) { setError('Please provide a more detailed scenario answer.'); return false; }
    } else if (s === 3) {
      if (formData.characterBackstory.trim().length < 150) { setError('Backstory is too short (min 150 chars).'); return false; }
    }
    return true;
  };

  const nextStep = () => { if (validateStep(step)) { setStep(p => p + 1); window.scrollTo(0, 0); } };
  const prevStep = () => { setStep(p => p - 1); window.scrollTo(0, 0); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      // Check for duplicates
      const isDuplicate = await checkDiscordDuplicate(formData.discordId);
      // We allow re-applying for different departments, but for now we trust the backend logic
      
      await submitApplication(formData, appType, currentUser.uid);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit.');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px', background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(167, 139, 250, 0.1)', borderRadius: '14px', color: '#fff',
    fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s ease',
  };

  const labelStyle = {
    display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)', fontFamily: '"Orbitron", sans-serif',
    letterSpacing: '1px', textTransform: 'uppercase',
  };

  if (authLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loading-spinner" /></div>;

  if (!currentUser) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
      <div className="sc-card" style={{ maxWidth: '450px', padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🛡️</div>
        <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '2rem', marginBottom: '16px' }}>Application Portal</h1>
        <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6 }}>To ensure the quality of our roleplay community, please sign in with Discord to begin your application.</p>
        <button onClick={handleDiscordLogin} disabled={loading} className="sc-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          {loading ? 'Connecting...' : (
            <>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01a13.98 13.98 0 0 0 12.084 0a.074.074 0 0 1 .078.01a10.122 10.122 0 0 0 .372.292a.077.077 0 0 1-.007.128a12.253 12.253 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.082.082 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.966 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/></svg>
              Continue with Discord
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
      <div className="sc-card" style={{ padding: '60px 48px', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>✅</div>
        <h2 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '2rem', marginBottom: '16px' }}>Successfully Submitted!</h2>
        <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.7 }}>Your application for the <b>{appType.toUpperCase()}</b> position has been sent to our recruitment team. We will contact you via Discord soon.</p>
        <Link to="/" className="sc-btn">Home</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="sc-container" style={{ maxWidth: view === 'selection' ? '1200px' : '800px' }}>
        
        {view === 'selection' ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '3rem', marginBottom: '12px' }}>Recruitment <span style={{ color: '#A78BFA' }}>Center</span></h1>
              <p style={{ color: '#94a3b8' }}>Welcome back, <b style={{ color: '#fff' }}>{userData?.discordUsername || userData?.name}</b>! Select a department to apply for.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {departments.map(dept => (
                <div key={dept.id} className="sc-card" style={{ padding: '40px 32px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.3s ease' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{dept.icon}</div>
                  <h3 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.4rem', marginBottom: '12px' }}>{dept.label}</h3>
                  <button onClick={() => startApplication(dept.id)} className="sc-btn-outline" style={{ border: `1px solid ${dept.color}`, color: dept.color, width: '100%' }}>
                    Start Application
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <button onClick={() => setView('selection')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '20px' }}>← Back to Selection</button>
              <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '2.2rem', marginBottom: '10px' }}>
                Applying for <span style={{ color: departments.find(d => d.id === appType).color }}>{departments.find(d => d.id === appType).label}</span>
              </h1>
              
              {/* Step indicator */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ 
                    width: '12px', height: '12px', borderRadius: '50%', 
                    background: step === s ? '#A78BFA' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s'
                  }} />
                ))}
              </div>
            </div>

            <div className="sc-card" style={{ padding: '40px' }}>
              {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '14px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontSize: '0.9rem' }}>⚠️ {error}</div>}
              
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={labelStyle}>Full Name (IC Name)</label>
                        <input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Age</label>
                        <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Discord Username (Prefilled)</label>
                      <input value={formData.discordId} disabled style={{ ...inputStyle, opacity: 0.6 }} />
                    </div>
                    {appType !== 'civilian' && (
                      <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Why do you want to join this department?</label>
                        <textarea value={formData.departmentReason} onChange={e => setFormData({...formData, departmentReason: e.target.value})} rows={5} style={{ ...inputStyle, resize: 'none' }} placeholder="What drives your choice?" />
                      </div>
                    )}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>RP Experience</label>
                      <textarea value={formData.rpExperience} onChange={e => setFormData({...formData, rpExperience: e.target.value})} rows={3} style={{ ...inputStyle, resize: 'none' }} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div style={{ background: 'rgba(167, 139, 250, 0.05)', padding: '24px', borderRadius: '14px', marginBottom: '24px' }}>
                       <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#A78BFA', marginBottom: '8px' }}>Scenario Task</h3>
                       <p style={{ fontStyle: 'italic', color: '#94a3b8', fontSize: '0.92rem' }}>
                         {appType === 'police' ? "A citizen claims they were robbed, but has no proof. Later, you find the suspect with the items. How do you proceed?" : 
                          appType === 'ems' ? "A mass casualty incident occurs. You are the only one on scene. How do you triage the victims?" :
                          "You see two people arguing in the street about a minor fender bender. Things are getting heated. What do you do?"}
                       </p>
                    </div>
                    <label style={labelStyle}>Your Response</label>
                    <textarea value={formData.scenarioAnswer} onChange={e => setFormData({...formData, scenarioAnswer: e.target.value})} rows={8} style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <label style={labelStyle}>Character Backstory</label>
                    <textarea value={formData.characterBackstory} onChange={e => setFormData({...formData, characterBackstory: e.target.value})} rows={10} style={{ ...inputStyle, resize: 'none' }} placeholder="Min 150 characters..." />
                    <p style={{ marginTop: '8px', fontSize: '0.75rem', color: formData.characterBackstory.length < 150 ? '#ef4444' : '#A78BFA' }}>
                      {formData.characterBackstory.length} / 150 characters
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                  {step > 1 && <button type="button" onClick={prevStep} className="sc-btn-outline" style={{ flex: 1 }}>Back</button>}
                  {step < 3 ? (
                    <button type="button" onClick={nextStep} className="sc-btn" style={{ flex: step > 1 ? 1 : '1 1 100%' }}>Next Step</button>
                  ) : (
                    <button type="submit" className="sc-btn" disabled={loading} style={{ flex: 1 }}>{loading ? 'Submitting...' : 'Complete Application'}</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Apply;

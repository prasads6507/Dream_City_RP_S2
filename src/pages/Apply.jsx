import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithDiscord } from '../services/authService';
import { submitApplication, subscribeToAppSettings, getUserApplications } from '../services/applicationService';

const Apply = () => {
  const { currentUser, userData, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('selection'); // selection, form
  const [appType, setAppType] = useState(null);
  const [step, setStep] = useState(1);
  
  const [appSettings, setAppSettings] = useState({
    policeLocked: true,
    emsLocked: true,
    mechanicLocked: true
  });

  const [userApplications, setUserApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Subscribe to real-time locks
  useEffect(() => {
    const unsubscribe = subscribeToAppSettings((settings) => {
      setAppSettings(settings);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '', // Discord Handle
    discordName: '', // Discord Global Name
    age: '',
    discordId: '', // Numeric ID
    rpExperience: '',
    departmentReason: '', // Why join PD/EMS/etc
    scenarioAnswer: '',
    characterBackstory: '',
  });

  // Prefill when user data is available & Fetch applications
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        fullName: userData.discordUsername || '',
        discordName: userData.name || '',
        discordId: userData.discordId || '',
      }));

      // Fetch existing applications
      if (userData.discordId) {
        const fetchApps = async () => {
          setLoadingApps(true);
          const apps = await getUserApplications(userData.discordId);
          setUserApplications(apps);
          setLoadingApps(false);
        };
        fetchApps();
      }
    }
  }, [userData]);

  // Determine standard role access fallback just in case, but global lock takes priority
  // Wait, user requested absolute admin control: if unlocked in admin, it's unlocked for everyone.
  // So we completely rely on appSettings.

  const departments = [
    { 
      id: 'civilian', 
      label: 'Allowlist Application', 
      desc: 'Submit your application to become a citizen of Dream City.',
      icon: '🏙️', 
      badge: 'SEASON 2', 
      badgeType: 'department',
      locked: false 
    },
    { 
      id: 'police', 
      label: 'Police Department', 
      desc: 'Join the LSPD and protect the streets of our city.',
      icon: '🚔', 
      badge: 'ALLOWLIST ONLY', 
      badgeType: 'membership',
      locked: appSettings.policeLocked
    },
    { 
      id: 'ems', 
      label: 'EMS Application', 
      desc: 'Save lives and provide medical assistance to help the injured.',
      icon: '🚑', 
      badge: 'ALLOWLIST ONLY', 
      badgeType: 'membership',
      locked: appSettings.emsLocked
    },
    { 
      id: 'mechanic', 
      label: 'Mechanic Application', 
      desc: 'Master the art of repair and help citizens with their vehicles.',
      icon: '🔧', 
      badge: 'ALLOWLIST ONLY', 
      badgeType: 'membership',
      locked: appSettings.mechanicLocked
    },
  ];

  const handleDiscordLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithDiscord();
      // Auto-advance to Civilian app for better UX
      setAppType('civilian');
      setView('form');
    } catch (err) {
      setError('Login failed. Please disable Adblockers and ensure cookies are enabled.');
    } finally {
      setLoading(false);
    }
  };

  const startApplication = (dept) => {
    if (dept.locked) return;
    setAppType(dept.id);
    setView('form');
    setStep(1);
  };

  const isDiscordIdValid = /^\d+$/.test(formData.discordId);

  const validateStep = (s) => {
    setError('');
    if (s === 1) {
      if (!isDiscordIdValid) {
        setError('Your Discord Identity is not set correctly. Please Log Out and Log In again.');
        return false;
      }
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
      // Check for duplicates again just in case
      const apps = await getUserApplications(formData.discordId);
      const isDuplicate = apps.some(app => app.type === appType);
      
      if (isDuplicate) {
        throw new Error(`You have already submitted a ${appType} application.`);
      }

      await submitApplication(formData, appType, currentUser.uid);
      setSubmitted(true);
      
      // Refresh applications list
      const updatedApps = await getUserApplications(formData.discordId);
      setUserApplications(updatedApps);
    } catch (err) {
      setError(err.message || 'Failed to submit.');
    } finally { setLoading(false); }
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
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.09 14.09 0 001.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128a10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01a13.98 13.98 0 0012.084 0a.074.074 0 01.078.01a10.122 10.122 0 00.372.292a.077.077 0 01-.007.128a12.253 12.253 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.082.082 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.966 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Continue with Discord
            </>
          )}
        </button>
        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '16px' }}>{error}</p>}
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
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', position: 'relative' }}>
      <div className="grid-lines" />
      
      <div className="sc-container" style={{ position: 'relative', zIndex: 1 }}>
        {view === 'selection' ? (
          <div>
            <div style={{ marginBottom: '60px' }}>
              <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '12px' }}>Available <span style={{ color: '#A78BFA' }}>Applications</span></h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Select an application below to submit your form. All applications are reviewed by our team.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {departments.map(dept => {
                const existingApp = userApplications.find(app => app.type === dept.id);
                const isLocked = dept.locked;
                
                return (
                  <div key={dept.id} className="sc-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className={`sc-badge sc-badge-${dept.badgeType}`}>{dept.badge}</span>
                      <span style={{ fontSize: '2rem' }}>{dept.icon}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.5rem', marginBottom: '8px' }}>{dept.label}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{dept.desc}</p>
                    </div>
                    
                    {existingApp ? (
                      <div style={{ 
                        marginTop: 'auto', 
                        padding: '16px', 
                        borderRadius: '12px', 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center'
                      }}>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Application Status</p>
                        <p style={{ 
                          fontFamily: '"Outfit", sans-serif', 
                          fontWeight: 900, 
                          color: existingApp.status === 'approved' ? '#22c55e' : (existingApp.status === 'rejected' ? '#ef4444' : '#f59e0b'),
                          textTransform: 'uppercase'
                        }}>
                          {existingApp.status}
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startApplication(dept)} 
                        className={isLocked ? 'sc-btn-outline' : 'sc-btn'} 
                        style={{ 
                          marginTop: 'auto', width: '100%', borderRadius: '8px', 
                          opacity: isLocked ? 0.35 : 1, filter: isLocked ? 'grayscale(1)' : 'none',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          display: 'flex', gap: '10px'
                        }}
                      >
                        {isLocked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
                        Apply Now
                      </button>
                    )}
                  </div>
                );
              })}
              
              {/* Priority Placeholder Card */}
              <div className="sc-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px dashed rgba(245, 158, 11, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="sc-badge sc-badge-priority">CLICK HERE TO BUY PRIORITY</span>
                  <span style={{ fontSize: '2rem' }}>⚡</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.5rem', marginBottom: '8px' }}>Priority Application</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>Skip the queue and get your application reviewed within 24 hours.</p>
                </div>
                <Link to="/store" className="sc-btn-outline" style={{ marginTop: 'auto', width: '100%', borderRadius: '8px', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b' }}>
                   Purchase Priority
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <button onClick={() => setView('selection')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '20px' }}>← Back to Selection</button>
              <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '2.2rem', marginBottom: '10px' }}>
                Applying for <span style={{ color: '#A78BFA' }}>{departments.find(d => d.id === appType).label}</span>
              </h1>
              
              {/* Step indicator */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ 
                    width: '30px', height: '4px', borderRadius: '2px', 
                    background: step === s ? '#A78BFA' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s'
                  }} />
                ))}
              </div>
            </div>

            <div className="sc-card" style={{ padding: '48px' }}>
              {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '14px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontSize: '0.9rem' }}>⚠️ {error}</div>}
              
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Discord Username</label>
                        <input className="sc-input" value={formData.fullName} disabled style={{ opacity: 0.8 }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Age</label>
                        <input className="sc-input" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                      </div>
                    </div>
                    {appType !== 'civilian' && (
                      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Why do you want to join this department?</label>
                        <textarea className="sc-input" value={formData.departmentReason} onChange={e => setFormData({...formData, departmentReason: e.target.value})} rows={5} style={{ resize: 'none' }} placeholder="What drives your choice?" />
                      </div>
                    )}
                    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>RP Experience</label>
                      <textarea className="sc-input" value={formData.rpExperience} onChange={e => setFormData({...formData, rpExperience: e.target.value})} rows={3} style={{ resize: 'none' }} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div style={{ background: 'rgba(167, 139, 250, 0.05)', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(167, 139, 250, 0.1)' }}>
                       <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#A78BFA', marginBottom: '8px', fontWeight: 800 }}>Scenario Task</h3>
                       <p style={{ fontStyle: 'italic', color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                         {appType === 'police' ? "A citizen claims they were robbed, but has no proof. Later, you find the suspect with the items. How do you proceed?" : 
                          appType === 'ems' ? "A mass casualty incident occurs. You are the only one on scene. How do you triage the victims?" :
                          "You see two people arguing in the street about a minor fender bender. Things are getting heated. What do you do?"}
                       </p>
                    </div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Your Response</label>
                    <textarea className="sc-input" value={formData.scenarioAnswer} onChange={e => setFormData({...formData, scenarioAnswer: e.target.value})} rows={8} style={{ resize: 'none' }} />
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Character Backstory</label>
                    <textarea className="sc-input" value={formData.characterBackstory} onChange={e => setFormData({...formData, characterBackstory: e.target.value})} rows={10} style={{ resize: 'none' }} placeholder="Min 150 characters..." />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <p style={{ fontSize: '0.75rem', color: formData.characterBackstory.length < 150 ? '#ef4444' : '#22c55e', fontWeight: 700 }}>
                        {formData.characterBackstory.length} / 150 characters
                      </p>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                  {step > 1 && <button type="button" onClick={prevStep} className="sc-btn-outline" style={{ flex: 1, borderRadius: '12px' }}>Back</button>}
                  {step < 3 ? (
                    <button type="button" onClick={nextStep} className="sc-btn" style={{ flex: step > 1 ? 1 : '1 1 100%', borderRadius: '12px' }}>Next Step</button>
                  ) : (
                    <button type="submit" className="sc-btn" disabled={loading} style={{ flex: 1, borderRadius: '12px' }}>{loading ? 'Submitting...' : 'Complete Application'}</button>
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

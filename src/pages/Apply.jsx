import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitPublicApplication, checkDiscordDuplicate } from '../services/applicationService';

const Apply = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [discordId, setDiscordId] = useState('');
  const [rpExperience, setRpExperience] = useState('');
  const [scenarioAnswer, setScenarioAnswer] = useState('');
  const [characterBackstory, setCharacterBackstory] = useState('');

  const inputStyle = {
    width: '100%', padding: '14px 18px',
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(167, 139, 250, 0.1)',
    borderRadius: '14px', color: '#fff',
    fontSize: '0.95rem', fontFamily: '"Inter", sans-serif',
    outline: 'none', transition: 'all 0.3s ease',
  };

  const labelStyle = {
    display: 'block', marginBottom: '8px',
    fontWeight: 700, fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
    fontFamily: '"Orbitron", sans-serif',
    letterSpacing: '1px', textTransform: 'uppercase',
  };

  const validateStep = (s) => {
    setError('');
    if (s === 1) {
      if (!fullName.trim()) { setError('Full Name is required'); return false; }
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) { setError('Please enter a valid age (13-100).'); return false; }
      if (!discordId.trim()) { setError('Discord ID is required'); return false; }
      if (rpExperience.trim().length < 20) { setError('Please provide more detail about your RP experience.'); return false; }
    } else if (s === 2) {
      if (scenarioAnswer.trim().length < 20) { setError('Please provide a more detailed scenario answer.'); return false; }
    } else if (s === 3) {
      if (characterBackstory.trim().length < 200) { setError('Backstory too short (min 200 chars).'); return false; }
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
      const isDuplicate = await checkDiscordDuplicate(discordId.trim());
      if (isDuplicate) throw new Error('An application with this Discord ID already exists.');
      await submitPublicApplication({
        name: fullName.trim(), age: parseInt(age), discordId: discordId.trim(),
        rpExperience: rpExperience.trim(), scenarioAnswer: scenarioAnswer.trim(),
        characterBackstory: characterBackstory.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit.');
    } finally { setLoading(false); }
  };

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
      <div className="sc-card" style={{ padding: '60px 48px', textAlign: 'center', maxWidth: '500px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>🌟</div>
        <h2 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.8rem', marginBottom: '16px' }}>Application Received!</h2>
        <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.7 }}>
          Your journey to <span style={{ color: '#A78BFA' }}>Dream City</span> has begun. We'll notify you via Discord DM.
        </p>
        <Link to="/" className="sc-btn">Return Home</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="sc-container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            marginBottom: '12px',
            color: '#A78BFA',
          }}>
            Whitelisting Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '40px' }}>
            Submit your details to join the community
          </p>
          
          {/* Step Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Orbitron", sans-serif', fontWeight: 800, fontSize: '1rem',
                  transition: 'all 0.4s ease',
                  background: step >= s ? '#A78BFA' : 'transparent',
                  color: step >= s ? '#000' : 'rgba(255,255,255,0.15)',
                  border: step >= s ? '2px solid #A78BFA' : '2px solid rgba(255,255,255,0.06)',
                  boxShadow: step >= s ? '0 0 20px rgba(167, 139, 250, 0.3)' : 'none',
                }}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div style={{ width: '40px', height: '2px', background: step > s ? '#A78BFA' : 'rgba(255,255,255,0.04)' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="sc-card" style={{ padding: '48px', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.02, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(#A78BFA 1px, transparent 1px), linear-gradient(90deg, #A78BFA 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />

          {error && (
            <div style={{
              padding: '14px 18px', borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171', fontSize: '0.9rem', marginBottom: '24px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            {step === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <span style={{ width: '4px', height: '24px', background: '#A78BFA', borderRadius: '4px' }} />
                  <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Out of Character</h3>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your real name" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#A78BFA'; e.target.style.boxShadow = '0 0 15px rgba(167,139,250,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(167,139,250,0.1)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Age</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="18+" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#A78BFA'; e.target.style.boxShadow = '0 0 15px rgba(167,139,250,0.15)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(167,139,250,0.1)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Discord Handle</label>
                    <input value={discordId} onChange={e => setDiscordId(e.target.value)} placeholder="Username#1234" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#A78BFA'; e.target.style.boxShadow = '0 0 15px rgba(167,139,250,0.15)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(167,139,250,0.1)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>RP Experience</label>
                  <textarea value={rpExperience} onChange={e => setRpExperience(e.target.value)} rows={4} placeholder="Tell us about servers you've played on..."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    onFocus={e => { e.target.style.borderColor = '#A78BFA'; e.target.style.boxShadow = '0 0 15px rgba(167,139,250,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(167,139,250,0.1)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <span style={{ width: '4px', height: '24px', background: '#A78BFA', borderRadius: '4px' }} />
                  <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>The Scene</h3>
                </div>
                <div style={{
                  background: 'rgba(167, 139, 250, 0.04)', border: '1px solid rgba(167, 139, 250, 0.1)',
                  padding: '24px', borderRadius: '16px', marginBottom: '24px',
                }}>
                  <h4 style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '3px', color: '#A78BFA', marginBottom: '12px', textTransform: 'uppercase' }}>Scenario</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                    "You are pulled over for a routine traffic stop. You have a concealed, unlicensed firearm. The officer approaches and smells alcohol. Describe your actions."
                  </p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Your Response</label>
                  <textarea value={scenarioAnswer} onChange={e => setScenarioAnswer(e.target.value)} rows={8} placeholder="How would you handle this situation in RP?"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '150px' }}
                    onFocus={e => { e.target.style.borderColor = '#A78BFA'; e.target.style.boxShadow = '0 0 15px rgba(167,139,250,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(167,139,250,0.1)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <span style={{ width: '4px', height: '24px', background: '#A78BFA', borderRadius: '4px' }} />
                  <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>The Legend</h3>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '20px' }}>Create a backstory for your character in Dream City.</p>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Character Backstory</label>
                  <textarea value={characterBackstory} onChange={e => setCharacterBackstory(e.target.value)} rows={12} placeholder="Who is your character? Where do they come from?"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '200px' }}
                    onFocus={e => { e.target.style.borderColor = '#A78BFA'; e.target.style.boxShadow = '0 0 15px rgba(167,139,250,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(167,139,250,0.1)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <p style={{
                  fontSize: '0.75rem', fontWeight: 700,
                  color: characterBackstory.length < 200 ? '#ef4444' : '#A78BFA',
                  fontFamily: '"Orbitron", sans-serif', letterSpacing: '1px',
                }}>
                  {characterBackstory.length} / 200 characters
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              {step > 1 && (
                <button type="button" onClick={prevStep} className="sc-btn-outline" style={{ flex: 1 }}>
                  Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="sc-btn" style={{ flex: step > 1 ? 1 : '1 1 100%' }}>
                  Next Stage →
                </button>
              ) : (
                <button type="submit" className="sc-btn" disabled={loading || characterBackstory.length < 200} style={{ flex: 1 }}>
                  {loading ? 'Submitting...' : '🚀 Finalize Submission'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;

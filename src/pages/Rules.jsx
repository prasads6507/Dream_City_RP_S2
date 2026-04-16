import { useState, useEffect } from 'react';

const Rules = () => {
  const [activeSection, setActiveSection] = useState('general');

  const ruleSections = [
    {
      id: 'general',
      title: 'General Rules',
      rules: [
        'Staying updated on any rule modifications on our website or Discord is your responsibility.',
        'Playing content that is protected by copyright (DMCA) is strictly prohibited. This includes copyrighted movies, music, and other protected materials.',
        'You must have a working, clear microphone.',
        'Engaging in Erotic Roleplay (ERP) is strictly prohibited within our community.',
        'Stream Sniping and Meta-gaming will result in an immediate permanent ban.',
        'You must stay in character at all times during active roleplay scenarios.',
        'Do not break the fourth wall or reference game mechanics during RP.',
      ]
    },
    {
      id: 'account',
      title: 'Account And Donations',
      rules: [
        'Selling or buying accounts/in-game assets for real world money is strictly prohibited.',
        'Donations are non-refundable and do not grant immunity from server rules.',
        'Account sharing is not permitted. You are responsible for any actions taken on your account.',
        'Chargebacks on donations will result in a permanent ban from all services.',
      ]
    },
    {
      id: 'cheating',
      title: 'Cheating And Exploiting',
      rules: [
        'Using third-party software to gain an advantage (aimbots, wallhacks, etc.) is a lifetime ban.',
        'Exploiting game bugs or mechanics for personal gain is prohibited. Report bugs to staff immediately.',
        'Combat logging (disconnecting during active RP or combat) is strictly forbidden.',
        'Using external communications during RP to share in-character information is metagaming.',
      ]
    },
    {
      id: 'roleplay',
      title: 'Roleplay Standards',
      rules: [
        'New Life Rule (NLR): After being downed and respawning, you forget everything from that scenario.',
        'Fear RP: You must value your character\'s life. If held at gunpoint, comply realistically.',
        'RDM (Random Deathmatch): Killing another player without valid RP reason is prohibited.',
        'VDM (Vehicle Deathmatch): Using vehicles as weapons without RP justification is not allowed.',
        'Powergaming: Forcing unrealistic actions on others or performing impossible feats is banned.',
      ]
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      for (let i = ruleSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(ruleSections[i].id);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(ruleSections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="sc-container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            color: '#A78BFA',
            marginBottom: '16px',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(167, 139, 250, 0.3)',
            textUnderlineOffset: '12px',
          }}>
            Server Rules
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '60px' }}>
          
          {/* Rules Content */}
          <div>
            {ruleSections.map((section, idx) => (
              <section key={section.id} id={section.id} style={{ marginBottom: '80px' }}>
                <h2 style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#A78BFA',
                  marginBottom: '32px',
                  paddingBottom: '16px',
                  borderBottom: '2px solid rgba(167, 139, 250, 0.15)',
                }}>
                  {section.title}
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {section.rules.map((rule, rIdx) => (
                    <div key={rIdx} style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '20px 24px',
                      background: 'rgba(8, 8, 12, 0.6)',
                      border: '1px solid rgba(167, 139, 250, 0.05)',
                      borderRadius: '14px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.15)'; e.currentTarget.style.background = 'rgba(167, 139, 250, 0.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.05)'; e.currentTarget.style.background = 'rgba(8, 8, 12, 0.6)'; }}
                    >
                      <span style={{
                        fontFamily: '"Orbitron", sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#A78BFA',
                        opacity: 0.5,
                        minWidth: '28px',
                        paddingTop: '2px',
                      }}>
                        {rIdx + 1}.
                      </span>
                      <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar TOC */}
          <div>
            <div style={{
              position: 'sticky',
              top: '120px',
              background: 'rgba(8, 8, 12, 0.6)',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <h4 style={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 800,
                fontSize: '0.65rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#A78BFA',
                marginBottom: '24px',
              }}>
                Table of Contents
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {ruleSections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      display: 'block',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      background: activeSection === section.id ? '#A78BFA' : 'transparent',
                      color: activeSection === section.id ? '#000' : 'rgba(255,255,255,0.35)',
                      boxShadow: activeSection === section.id ? '0 0 20px rgba(167,139,250,0.3)' : 'none',
                    }}
                  >
                    {section.title}
                  </a>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '24px', paddingTop: '20px' }}>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                  Rules are subject to change. Ignorance of rules is not an excuse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .sc-container > div:last-child { grid-template-columns: 1fr !important; }
          .sc-container > div:last-child > div:last-child { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Rules;

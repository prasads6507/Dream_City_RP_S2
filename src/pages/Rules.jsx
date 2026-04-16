import { useState, useEffect } from 'react';

const Rules = () => {
  const [activeSection, setActiveSection] = useState('general');

  const ruleSections = [
    {
      id: 'conduct',
      title: 'Community Conduct',
      rules: [
        'Respect Everyone: Treat all members with respect. Harassment, insults, discrimination, or personal attacks will not be tolerated.',
        'Keep It Friendly: This is a community for fun and roleplay. Avoid toxic behavior, arguments, or unnecessary drama.',
        'No Hate Speech: Racism, casteism, religious hate, or offensive language of any kind is strictly prohibited.',
        'No Spam or Advertising: Do not spam messages, emojis, or mentions. Advertising or self-promotion is not allowed without staff permission.',
        'Follow Proper Communication: Use appropriate channels for conversations. Avoid unnecessary pinging of staff or members.',
      ]
    },
    {
      id: 'rp-standards',
      title: 'Roleplay Standards',
      rules: [
        'Maintain Quality: Always maintain realistic and serious roleplay. Fail RP, RDM (Random Deathmatch), and VDM (Vehicle Deathmatch) are strictly forbidden.',
        'No Meta Gaming: Using out-of-character information (Discord, streams, etc.) in roleplay is not allowed.',
        'Value Your Character: Act as if your character’s life matters. Avoid unrealistic or troll behavior during RP situations.',
      ]
    },
    {
      id: 'admin',
      title: 'Staff & Reporting',
      rules: [
        'Staff Authority: Follow instructions given by admins and moderators. Do not argue publicly—use proper channels or tickets for disputes.',
        'Reports & Complaints: Submit reports with proper proof. False or misleading reports will result in punishment.',
        'Prohibited Content: No NSFW, illegal, or inappropriate content. Keep the server safe and clean for everyone.',
      ]
    },
    {
      id: 'enforcement',
      title: 'Punishments',
      rules: [
        'Warnings: First level of enforcement for minor infractions.',
        'Mute/Kick: Used for communication issues or immediate disruptions.',
        'Temporary Ban: Time-sensitive removal from the server.',
        'Permanent Ban: Lifetime removal for severe or repeated violations.',
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

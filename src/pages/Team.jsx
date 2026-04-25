const Team = () => {
  const staff = [
    { name: 'DCRP || ROCKY', role: 'FOUNDER', avatar: '/images/rocky_avatar.png' },
    { name: 'DCRP || AGENT', role: 'ADMIN', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=agent' },
    { name: 'DCRP || DEV', role: 'ADMIN', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=dev' },
    { name: 'DCRP || ALPHA', role: 'DEVELOP', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=alpha' },
    { name: 'DCRP || OMEGA', role: 'DEVELOP', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=omega' },
    { name: 'DCRP || AX10R', role: 'DC DEV & STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ax10r' },
    { name: 'DCRP || COMMANDER', role: 'DC DEV & STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=commander' },
    { name: 'DCRP || ROMEO', role: 'DC STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=phantom' },
    { name: 'DCRP || MAXX', role: 'DC TICKET STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=maxx' },
    { name: 'DCRP || PETER', role: 'DC TICKET STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=devil' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="sc-container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <p style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '5px',
            textTransform: 'uppercase',
            color: '#A78BFA',
            marginBottom: '20px',
          }}>
            Our Elite Group
          </p>
          <h1 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.2,
            marginBottom: '20px',
          }}>
            Team Behind the Success of <br />
            <span style={{ color: '#A78BFA', fontStyle: 'italic' }}>Dream City</span>
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '550px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
            The talented team powering Dream City's immersive and dynamic roleplay experience.
          </p>
        </div>

        {/* Staff Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {staff.map((member, i) => (
            <div
              key={member.name}
              className="sc-card"
              style={{
                padding: '40px 32px',
                textAlign: 'center',
                transition: 'all 0.4s ease',
              }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '28px' }}>
                <div style={{
                  width: '120px', height: '120px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '2px solid rgba(167, 139, 250, 0.3)',
                  boxShadow: '0 0 20px rgba(167, 139, 250, 0.1)',
                  padding: '4px',
                }}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px', background: '#111' }}
                  />
                </div>
                {/* Role badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-8px',
                  background: '#A78BFA',
                  color: '#000',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 800,
                  fontSize: '0.55rem',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 12px rgba(167, 139, 250, 0.4)',
                }}>
                  {member.role}
                </div>
              </div>

              {/* Name & Subtitle */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  marginBottom: member.subtitle ? '4px' : '0',
                }}>
                  {member.name}
                </h3>
                {member.subtitle && (
                  <p style={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#A78BFA',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}>
                    {member.subtitle}
                  </p>
                )}
              </div>

              {/* Social Icons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                {/* Discord */}
                <a href="https://discord.gg/GdKgR2qTgr" target="_blank" rel="noopener noreferrer" style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: 'rgba(167, 139, 250, 0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#A78BFA',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(167, 139, 250, 0.1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#A78BFA'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 20px rgba(167,139,250,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(167, 139, 250, 0.08)'; e.currentTarget.style.color = '#A78BFA'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01a13.98 13.98 0 0 0 12.084 0a.074.074 0 0 1 .078.01a10.122 10.122 0 0 0 .372.292a.077.077 0 0 1-.007.128a12.253 12.253 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.082.082 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.966 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a href="#" style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: 'rgba(167, 139, 250, 0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#A78BFA',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(167, 139, 250, 0.1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#A78BFA'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 20px rgba(167,139,250,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(167, 139, 250, 0.08)'; e.currentTarget.style.color = '#A78BFA'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;

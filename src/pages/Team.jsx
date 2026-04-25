const Team = () => {
  const staff = [
    { name: 'DCRP || CAPTAIN', role: 'FOUNDER', avatar: '/images/rocky_avatar.png' },
    { name: 'DCRP || AGENT', role: 'ADMIN', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=agent' },
    { name: 'DCRP || DEV', role: 'ADMIN', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=dev' },
    { name: 'DCRP || ALPHA', role: 'DEVELOP', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=alpha' },
    { name: 'DCRP || OMEGA', role: 'DEVELOP', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=omega' },
    { name: 'DCRP || AX10R', role: 'DC DEV & STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ax10r' },
    { name: 'DCRP || COMMANDER', role: 'DC DEV & STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=commander' },
    { name: 'DCRP || ROMEO', role: 'DC STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=phantom' },
    { name: 'DCRP || MAXX', role: 'DC TICKET STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=maxx' },
    { name: 'DCRP || PETER', role: 'DC TICKET STAFF', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=devil' },
    { name: 'DCRP || ROCKY', role: 'WEBSITE DESIGNER', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=rocky' },
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


            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;

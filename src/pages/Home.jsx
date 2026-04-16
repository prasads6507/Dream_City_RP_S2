import { Link } from 'react-router-dom';

const Home = () => {
  const galleryImages = [
    { src: '/images/gallery-1.png', label: 'The Crew' },
    { src: '/images/gallery-2.png', label: 'In Pursuit' },
    { src: '/images/gallery-3.png', label: 'City Lights' },
    { src: '/images/gallery-4.png', label: 'Boardwalk Life' },
    { src: '/images/gallery-5.png', label: 'LSPD Patrol' },
    { src: '/images/gallery-6.png', label: 'Midnight Run' },
    { src: '/images/gallery-7.png', label: 'Rooftop Vibes' },
  ];

  return (
    <div style={{ position: 'relative' }}>

      {/* ===== HERO SECTION ===== */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.25) saturate(1.3)',
        }} />
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, #000000 100%)',
        }} />

        <div className="sc-container" style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', padding: '140px 24px 100px' }}>
          {/* Left: Text */}
          <div>
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
                #LifeInDreamCity
              </span>
            </div>

            {/* Main Title */}
            <h1 style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(1.5rem, 3.8vw, 3.2rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: '24px',
              color: '#fff',
              whiteSpace: 'nowrap',
              animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both',
            }}>
              Welcome to Dream City Roleplay
            </h1>
            <h2 style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '24px',
              color: '#A78BFA',
              animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both',
            }}>
              Season 2
            </h2>



            {/* Buttons */}
            <div style={{
              display: 'flex', gap: '16px', flexWrap: 'wrap',
              animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both',
            }}>
              <a href="https://discord.gg/GdKgR2qTgr" target="_blank" rel="noopener noreferrer" className="sc-btn">
                Join Discord
              </a>
              <Link to="/apply" className="sc-btn-outline">
                Apply Now
              </Link>
            </div>
          </div>

          {/* Right: Featured Video/Image Card */}
          <div style={{ animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both' }}>
            {/* Main video card */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(167, 139, 250, 0.15)',
              boxShadow: '0 0 60px rgba(167, 139, 250, 0.08)',
              position: 'relative',
              aspectRatio: '16/10',
            }}>
              <img src="/images/gallery-1.png" alt="Dream City Roleplay" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(167, 139, 250, 0.6)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                }}>
                  <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '18px solid #000', marginLeft: '4px' }} />
                </div>
              </div>
            </div>

            {/* Smaller preview cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
              <div style={{
                borderRadius: '16px', overflow: 'hidden', position: 'relative', aspectRatio: '16/9',
                border: '1px solid rgba(167, 139, 250, 0.08)',
              }}>
                <img src="/images/gallery-2.png" alt="Preview 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(167,139,250,0.5)' }}>
                    <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '10px solid #000', marginLeft: '2px' }} />
                  </div>
                </div>
              </div>
              <div style={{
                borderRadius: '16px', overflow: 'hidden', position: 'relative', aspectRatio: '16/9',
                border: '1px solid rgba(167, 139, 250, 0.08)',
              }}>
                <img src="/images/gallery-3.png" alt="Preview 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(167,139,250,0.5)' }}>
                    <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '10px solid #000', marginLeft: '2px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      <section style={{ padding: '100px 0', position: 'relative' }}>
        <div className="sc-container">
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              marginBottom: '16px',
              color: '#fff',
            }}>
              Feel the Pulse of <span style={{ color: '#A78BFA' }}>Dream City</span>
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '550px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Step into a world crafted for storytellers. From high-stakes heists to immersive civilian life.
            </p>
          </div>

          {/* Bento Grid Gallery */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'auto auto',
            gap: '16px',
          }}>
            {galleryImages.slice(0, 7).map((img, i) => {
              // First row: 3 images spanning positions, second row: 4 images
              const gridStyles = [
                { gridColumn: 'span 2', gridRow: 'span 1' },   // 0 - wide
                { gridColumn: 'span 1', gridRow: 'span 1' },   // 1
                { gridColumn: 'span 1', gridRow: 'span 1' },   // 2
                { gridColumn: 'span 1', gridRow: 'span 1' },   // 3
                { gridColumn: 'span 1', gridRow: 'span 1' },   // 4
                { gridColumn: 'span 1', gridRow: 'span 1' },   // 5
                { gridColumn: 'span 1', gridRow: 'span 1' },   // 6
              ];
              return (
                <div
                  key={i}
                  className="sc-card"
                  style={{
                    ...gridStyles[i],
                    overflow: 'hidden',
                    position: 'relative',
                    aspectRatio: i === 0 ? '2/1' : '16/10',
                    cursor: 'pointer',
                    padding: 0,
                    borderRadius: '16px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
                    e.currentTarget.querySelector('.overlay').style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                    e.currentTarget.querySelector('.overlay').style.opacity = '0';
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', display: 'block' }}
                  />
                  <div className="overlay" style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                    display: 'flex', alignItems: 'flex-end',
                    padding: '20px',
                  }}>
                    <span style={{ color: '#A78BFA', fontFamily: '"Orbitron", sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                      {img.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY CTA ===== */}
      <section style={{ padding: '100px 0', borderTop: '1px solid rgba(167, 139, 250, 0.06)' }}>
        <div className="sc-container">
          <div className="sc-card" style={{
            padding: '80px 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Inner grid effect */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
              backgroundImage: 'linear-gradient(#A78BFA 1px, transparent 1px), linear-gradient(90deg, #A78BFA 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />

            <h3 style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900,
              marginBottom: '20px',
              position: 'relative',
              zIndex: 1,
            }}>
              Join <span style={{ color: '#A78BFA' }}>Telugu</span> <br />
              <span style={{ color: '#A78BFA' }}>RP Community</span>
            </h3>
            <p style={{
              maxWidth: '550px', margin: '0 auto 40px', color: '#94a3b8',
              fontSize: '1.05rem', lineHeight: 1.7, position: 'relative', zIndex: 1,
            }}>
              We are community and passionate about creating high-quality roleplay experiences.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              <a href="https://discord.gg/GdKgR2qTgr" target="_blank" rel="noopener noreferrer" className="sc-btn">
                Enter Discord
              </a>
              <Link to="/rules" className="sc-btn-outline">
                Read Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

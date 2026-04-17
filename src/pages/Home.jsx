import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoContainerRef = useRef(null);

  const toggleMute = () => {
    if (videoContainerRef.current) {
      const video = videoContainerRef.current.querySelector('video');
      if (video) {
        video.muted = !video.muted;
        setIsMuted(video.muted);
      }
    }
  };

  // Force autoplay on iOS
  useEffect(() => {
    if (videoContainerRef.current) {
      const video = videoContainerRef.current.querySelector('video');
      if (video) {
        video.defaultMuted = true;
        video.muted = true;
        video.play().catch(error => {
          console.warn("Autoplay was prevented by browser:", error);
        });
      }
    }
  }, []);

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
        {/* Background Video - Rendered via dangerouslySetInnerHTML to enforce iOS Safari strict autoplay policies */}
        <div 
          ref={videoContainerRef}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%'
          }}
          dangerouslySetInnerHTML={{
            __html: `
              <video 
                autoplay 
                loop 
                muted 
                playsinline 
                webkit-playsinline
                preload="auto"
                style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.9) saturate(1.1); pointer-events: none;"
              >
                <source src="/background.mp4" type="video/mp4" />
              </video>
            `
          }}
        />
        {/* Lighter gradient overlay mostly for bottom edge fade */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.9) 100%)',
        }} />

        {/* Text backdrop for readability */}
        <div className="sc-container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', textAlign: 'center', padding: '140px 24px 100px' }}>
          <div style={{
            position: 'absolute', top: '100px', width: '80%', height: '300px',
            background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none', zIndex: -1
          }}></div>
          {/* Top: Text */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              textShadow: '0 4px 40px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)',
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
              textShadow: '0 4px 40px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)',
              animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both',
            }}>
              Season 2
            </h2>



            {/* Buttons */}
            <div style={{
              display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
              animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both',
              width: '100%', maxWidth: '500px', margin: '0 auto'
            }}>
              <a href="https://discord.gg/GdKgR2qTgr" target="_blank" rel="noopener noreferrer" className="sc-btn" style={{ flex: '1 1 200px' }}>
                Join Discord
              </a>
              <div style={{ display: 'flex', gap: '12px', flex: '1 1 250px', justifyContent: 'center' }}>
                <Link to="/apply" className="sc-btn-outline" style={{ flex: '1' }}>
                  Apply Now
                </Link>
                <button 
                  onClick={toggleMute}
                  style={{
                    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%', width: '48px', height: '48px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.3s ease'
                  }}
                  title={isMuted ? "Unmute Video" : "Mute Video"}
                >
                  {isMuted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom: Trailer Previews / Gallery Highlights */}
          <div style={{ animation: 'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both', width: '100%', marginTop: '40px' }}>
            <div style={{ 
              display: 'flex', gap: '16px', overflowX: 'auto', padding: '10px 20px', 
              alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
              maxWidth: '100vw', scrollSnapType: 'x mandatory' 
            }}>
              {[1, 2, 3].map(num => (
                <div key={num} style={{
                  width: 'min(240px, 85vw)', /* Makes it scale properly on small mobile screens */
                  aspectRatio: '16/9',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(167, 139, 250, 0.1)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#A78BFA';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.1)';
                }}
                >
                  <img src={`/images/gallery-${num}.png`} alt={`Preview ${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(167,139,250,0.5)' }}>
                      <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid #000', marginLeft: '3px' }} />
                    </div>
                  </div>
                </div>
              ))}
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

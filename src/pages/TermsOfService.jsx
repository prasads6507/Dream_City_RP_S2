import { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Agreement to Terms",
      content: "By accessing and using the Dream City Roleplay S2 website and community, you agree to be bound by these Terms of Service and all applicable laws and regulations."
    },
    {
      title: "Community Guidelines",
      content: "Users must adhere to the community rules established by the staff. Failure to comply with server rules, harassment of other members, or disruptive behavior may result in permanent suspension from the community."
    },
    {
      title: "Account Security",
      content: "You are responsible for maintaining the security of your Discord account. Any actions taken through your account on our platform are your responsibility."
    },
    {
      title: "Virtual Conduct",
      content: "Roleplay is a collaborative creative experience. All participants must maintain realism and seriality as defined in the server rules. Out-of-character (OOC) toxicity is strictly prohibited."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', position: 'relative' }}>
      <div className="grid-lines" />
      <div className="sc-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Terms of <span style={{ color: '#A78BFA' }}>Service</span>
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sections.map((section, idx) => (
              <div key={idx} className="sc-card" style={{ padding: '40px' }}>
                <h2 style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#A78BFA',
                  marginBottom: '16px'
                }}>
                  {section.title}
                </h2>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '1rem',
                  lineHeight: 1.8
                }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
              Last Updated: April 21, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

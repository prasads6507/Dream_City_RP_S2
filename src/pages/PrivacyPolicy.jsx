import { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Data Collection",
      content: "We collect basic Discord profile information such as your username, ID, and email address when you sign in. This data is exclusively used to manage your account and process your whitelist applications."
    },
    {
      title: "How We Use Your Data",
      content: "Your information is used to personalize your experience, secure our community, and communicate the status of your applications via Discord DM and channel notifications."
    },
    {
      title: "Data Protection",
      content: "We implement a variety of security measures to maintain the safety of your personal information. Your data is stored securely in our private database and is never shared with third parties or sold for any purpose."
    },
    {
      title: "Affiliation",
      content: "Dream City Roleplay S2 is an independent gaming community. We are not affiliated with, endorsed by, or in any way officially connected with Rockstar Games, Take-Two Interactive, or any of their subsidiaries or affiliates."
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
            Privacy <span style={{ color: '#A78BFA' }}>Policy</span>
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

export default PrivacyPolicy;

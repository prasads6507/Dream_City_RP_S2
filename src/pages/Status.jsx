import { useEffect } from 'react';
import ServerStatus from '../components/ServerStatus';

const Status = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', position: 'relative' }}>
      <div className="grid-lines" />
      <div className="sc-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '16px'
          }}>
            Server <span style={{ color: '#A78BFA' }}>Live Status</span>
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Monitor real-time performance and connection metrics for Dream City Roleplay. 
            Information updates automatically every minute.
          </p>
        </div>

        {/* Reuse the specialized ServerStatus component */}
        <div style={{ borderTop: 'none' }}>
           <ServerStatus />
        </div>

        {/* Additional Detail Section */}
        <div className="sc-card" style={{ marginTop: '40px', padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            <div>
              <h3 style={{ fontFamily: '"Outfit", sans-serif', color: '#A78BFA', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 800 }}>
                Connection Troubleshooting
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
                If you're having trouble connecting, ensure your FiveM client is up to date and you have a stable internet connection. 
                You can also try connecting via the console using <code>connect 4gblo45</code>.
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: '"Outfit", sans-serif', color: '#A78BFA', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 800 }}>
                Server Support
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Need help or found a bug? Join our official Discord community and open a support ticket. 
                Our team is available 24/7 to assist with any in-game or technical issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;

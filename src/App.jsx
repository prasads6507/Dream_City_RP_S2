import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import ParticleBackground from './components/ParticleBackground';
import CarAnimation from './components/CarAnimation';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Apply from './pages/Apply';
import AdminDashboard from './pages/AdminDashboard';
import Rules from './pages/Rules';
import Team from './pages/Team';
import Store from './pages/Store';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Status from './pages/Status';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div className={`flex flex-col min-h-screen ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`}>
        <ParticleBackground />
        <CarAnimation />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/team" element={<Team />} />
            <Route path="/store" element={<Store />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/status" element={<Status />} />
            
            {/* Public application route (No Login Required) */}
            <Route path="/apply" element={<Apply />} />

            {/* Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Analytics />
    </>
  );
}

export default App;

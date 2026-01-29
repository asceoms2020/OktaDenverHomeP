import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Home from '../pages/Home';
import About from '../pages/About';
import Events from '../pages/Events';
import Newsletter from '../pages/Newsletter';
import Resources from '../pages/Resources';
import Sponsors from '../pages/Sponsors';
import Trading from '../pages/Trading';
import Admin from '../pages/Admin';
import MouEvent2026 from '../pages/MouEvent2026';
import ResetPassword from '../pages/ResetPassword';
import { useAuth } from '../context/AuthContext';

const AuthRedirector = () => {
  const { redirectPath, clearRedirectPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!redirectPath) return;
    clearRedirectPath();
    if (location.pathname === redirectPath) return;
    navigate(redirectPath, { replace: true });
  }, [redirectPath, clearRedirectPath, navigate, location.pathname]);

  return null;
};

const AppRoutes = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <AuthRedirector />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/mouevent2026" element={<MouEvent2026 />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes; 

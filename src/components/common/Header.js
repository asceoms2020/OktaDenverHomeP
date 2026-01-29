import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/World-Okta.png';
import LanguageSwitch from '../LanguageSwitch';
import LoginModal from '../LoginModal';
import SignUpModal from '../../components/SignUpModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../translations/translations';
import '../../styles/components/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const t = translations[language].navigation || {
    home: "Home",
    events: "Events",
    resources: "Resources",
    newsletter: "Newsletter",
    about: "About",
    sponsors: "Sponsors",
    donation: "Donation"
  };

  // 로그인 상태가 변경되면(로그인 성공 시) 모달을 닫습니다.
  useEffect(() => {
    if (user) {
      setIsLoginOpen(false);
      setIsSignUpOpen(false);
    }
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      closeMenu();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <div className="logo-container">
            <img src={logoImage} alt="OKTA DENVER" className="logo-image" />
            <div className="organization-info">
              <div className="corp-name">Korean Community Association of Colorado, Inc.</div>
              <div className="dba-name">OKTA Denver (D.B.A.)</div>
            </div>
          </div>
        </Link>
        <button className="mobile-menu-button" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
        <div className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>{t.home}</Link>
          <Link to="/events" className="nav-link" onClick={closeMenu}>{t.events}</Link>
          <Link to="/resources" className="nav-link" onClick={closeMenu}>{t.resources}</Link>
          <Link to="/newsletter" className="nav-link" onClick={closeMenu}>{t.newsletter}</Link>
          <Link to="/about" className="nav-link" onClick={closeMenu}>{t.about}</Link>
          <Link to="/sponsors" className="nav-link" onClick={closeMenu}>{t.sponsors}</Link>
          
          {/* Conditional Menu: Trading (Only for Logged in users) */}
          {user && (
            <Link to="/trading" className="nav-link" onClick={closeMenu}>
              {language === 'ko' ? '무역하기' : 'Trading'}
            </Link>
          )}

          {user ? (
            <button 
              className="auth-button" 
              onClick={handleLogout}
            >
              {language === 'ko' ? '로그아웃' : 'Logout'}
            </button>
          ) : (
            <button 
              className="auth-button" 
              onClick={() => {
                setIsLoginOpen(true);
                closeMenu();
              }}
            >
              Login
            </button>
          )}

          <a 
            href="https://www.zeffy.com/donation-form/donate-to-change-lives-1296"
            target="_blank" 
            rel="noopener noreferrer"
            className="donation-button"
            onClick={closeMenu}
          >
            {t.donation}
          </a>
          <LanguageSwitch />
        </div>
      </nav>
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSignUpClick={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </header>
  );
};

export default Header;
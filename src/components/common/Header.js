import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/World-Okta.png';
import LanguageSwitch from '../LanguageSwitch';
import LoginModal from '../LoginModal';
import SignUpModal from '../../components/SignUpModal';
import ProfileEditModal from '../../components/ProfileEditModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../translations/translations';
import '../../styles/components/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { language } = useLanguage();
  const { user, userProfile, isAdmin, signOut } = useAuth();
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

  // Profile Completion Gate
  useEffect(() => {
    if (user && userProfile) {
      // Check for missing required fields
      // Assuming full_name and phone_number are mandatory
      const isProfileIncomplete = !userProfile.full_name_ko || !userProfile.full_name_en || !userProfile.phone_number || !userProfile.gender;

      if (isProfileIncomplete) {
        setIsProfileOpen(true);
      }
    }
  }, [user, userProfile]);

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
    <>
      <header className={`header${isScrolled ? ' header--scrolled' : ''}`}>
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
            <Link to="/about" className="nav-link" onClick={closeMenu}>{t.about}</Link>
            <Link to="/events" className="nav-link" onClick={closeMenu}>{t.events}</Link>
            <Link to="/resources" className="nav-link" onClick={closeMenu}>{t.resources}</Link>
            <Link to="/newsletter" className="nav-link" onClick={closeMenu}>{t.newsletter}</Link>
            <Link to="/sponsors" className="nav-link" onClick={closeMenu}>{t.sponsors}</Link>
            <Link to="/places" className="nav-link" onClick={closeMenu}>{language === 'ko' ? '교류회 장소' : 'Venues'}</Link>

            {/* Conditional Menu: Trading (Only for Logged in users) */}
            {/* {user && (
              <Link to="/trading" className="nav-link" onClick={closeMenu}>
                {language === 'ko' ? '무역하기' : 'Trading'}
              </Link>
            )} */}

            {/* Conditional Menu: MOU Event Management (Admins only) */}
            {user && isAdmin && (
              <Link to="/admin/mouevent" className="nav-link" onClick={closeMenu}>
                {language === 'ko' ? 'MOU 이벤트 관리' : 'MOU Event Mgmt'}
              </Link>
            )}

            {user ? (
              <div className="auth-buttons-container">
                <button
                  className="profile-button"
                  onClick={() => {
                    setIsProfileOpen(true);
                    closeMenu();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {language === 'ko' ? '내 정보' : 'Profile'}
                </button>
                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  {language === 'ko' ? '로그아웃' : 'Logout'}
                </button>
              </div>
            ) : (
              <button
                className="login-button"
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
      </header>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignUpClick={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      <ProfileEditModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        force={user && userProfile && (!userProfile.full_name_ko || !userProfile.full_name_en || !userProfile.phone_number || !userProfile.gender)}
      />
    </>
  );
};

export default Header;

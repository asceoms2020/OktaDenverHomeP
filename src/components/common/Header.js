import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../../assets/images/World-Okta.png';
import LanguageSwitch from '../LanguageSwitch';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import '../../styles/components/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].navigation || {
    home: "Home",
    events: "Events",
    resources: "Resources",
    newsletter: "Newsletter",
    about: "About",
    sponsors: "Sponsors",
    donation: "Donation"
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
  );
};

export default Header;
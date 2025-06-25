import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../../assets/images/World-Okta.png';
import LanguageSwitch from '../LanguageSwitch';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import '../../styles/components/Header.css';

const HeaderContainer = styled.header`
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  
  &:hover {
    color: #2ecc71;
  }
`;

const DonationButton = styled.a`
  background: transparent;
  color: #3498db;
  padding: 8px 16px;
  border: 2px solid #3498db;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: #3498db;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.25);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background-color: #fff;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 999;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 768px) {
    display: block;
  }
`;

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
    <HeaderContainer>
      <Nav>
        <StyledLink to="/" onClick={closeMenu}>
          <img src={logoImage} alt="OKTA DENVER" style={{ height: '40px', width: 'auto' }} />
        </StyledLink>
        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
        <NavLinks isOpen={isMenuOpen}>
          <StyledLink to="/" onClick={closeMenu}>{t.home}</StyledLink>
          <StyledLink to="/events" onClick={closeMenu}>{t.events}</StyledLink>
          <StyledLink to="/resources" onClick={closeMenu}>{t.resources}</StyledLink>
          <StyledLink to="/newsletter" onClick={closeMenu}>{t.newsletter}</StyledLink>
          <StyledLink to="/about" onClick={closeMenu}>{t.about}</StyledLink>
          <StyledLink to="/sponsors" onClick={closeMenu}>{t.sponsors}</StyledLink>
          <DonationButton 
            href="https://www.zeffy.com/donation-form/donate-to-change-lives-1296"
            target="_blank" 
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            {t.donation}
          </DonationButton>
          <LanguageSwitch />
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
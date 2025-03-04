import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../../assets/images/logo.png';
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

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Header = () => {
  const { language } = useLanguage();
  const t = translations[language].navigation || {
    home: "Home",
    about: "About",
    news: "News"
  };

  return (
    <HeaderContainer>
      <Nav>
        <StyledLink to="/">
          <img src={logoImage} alt="OKTA DENVER" style={{ height: '40px', width: 'auto' }} />
        </StyledLink>
        <NavLinks>
          <StyledLink to="/">{t.home}</StyledLink>
          <StyledLink to="/about">{t.about}</StyledLink>
          <StyledLink to="/news">{t.news}</StyledLink>
          <LanguageSwitch />
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 
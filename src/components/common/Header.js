import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../../assets/images/logo.png';

const HeaderContainer = styled.header`
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    color: #666;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Nav>
        <StyledLink to="/">
          <img src={logoImage} alt="OKTA DENVER" style={{ height: '40px', width: 'auto' }} />
        </StyledLink>
        <div>
          <StyledLink to="/home">Home</StyledLink>
          <StyledLink to="/about"style={{ marginLeft: '20px' }}>About</StyledLink>
          <StyledLink to="/news" style={{ marginLeft: '20px' }}>News</StyledLink>
        </div>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 
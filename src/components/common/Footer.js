import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

const FooterContainer = styled.footer`
  background: #2c3e50;
  color: white;
  padding: 40px 20px;
  text-align: center;
  margin-top: 50px;
  width: 100%;
`;

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language]?.footer;

  return (
    <FooterContainer>
      <h2>OKTA Denver Footer</h2>
      <p>Contact: info@oktadenver.org</p>
      <p>Phone: 303.555.0123</p>
      <p>© 2024 OKTA Denver. All rights reserved.</p>
      {t && <p>Translation loaded: {language}</p>}
    </FooterContainer>
  );
};

export default Footer; 
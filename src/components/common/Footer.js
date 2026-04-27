import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

const FooterWrapper = styled.footer`
  background: linear-gradient(175deg, #0f172a 0%, #1a2744 100%);
  color: rgba(255, 255, 255, 0.82);
  padding: 64px 24px 0;
  margin-top: 80px;
  width: 100%;
`;

const FooterGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BrandColumn = styled.div`
  @media (max-width: 900px) {
    grid-column: 1 / -1;
  }
`;

const BrandName = styled.h3`
  font-size: 1.45rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.3rem;
  letter-spacing: -0.025em;
`;

const BrandMeta = styled.p`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.38);
  margin-bottom: 0.15rem;
  line-height: 1.5;

  &.italic {
    font-style: italic;
    margin-bottom: 0;
  }
`;

const Tagline = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.58);
  line-height: 1.75;
  margin-top: 1.1rem;
  max-width: 300px;
`;

const EmeraldDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
`;

const FooterColumn = styled.div``;

const FooterHeading = styled.h4`
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 1.2rem;
`;

const FooterNavLink = styled(Link)`
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.7rem;
  transition: color 0.2s ease, transform 0.2s ease;
  width: fit-content;

  &:hover {
    color: #10b981;
    transform: translateX(3px);
  }
`;

const ContactRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.75rem;
  line-height: 1.5;
`;

const ContactLabel = styled.span`
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.75rem;
  min-width: 48px;
  padding-top: 1px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const DonateLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 9px 22px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.22s ease;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  letter-spacing: 0.01em;

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
  }
`;

const Divider = styled.div`
  max-width: 1200px;
  margin: 3.5rem auto 0;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.28);
  margin: 0;
`;

const WorldOktaLink = styled.a`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  transition: color 0.2s ease;
  letter-spacing: 0.01em;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language]?.navigation || {};

  return (
    <FooterWrapper>
      <FooterGrid>
        <BrandColumn>
          <BrandName>
            <EmeraldDot />
            OKTA Denver
          </BrandName>
          <BrandMeta>Korean Community Association of Colorado, Inc.</BrandMeta>
          <BrandMeta className="italic">D.B.A. OKTA Denver (World-OKTA)</BrandMeta>
          <Tagline>
            {language === 'ko'
              ? '덴버 한인 무역인 협회는 한인 기업가들의 성장과 글로벌 네트워크를 지원합니다.'
              : 'Connecting Korean entrepreneurs in Denver through global trade, community, and cultural exchange.'}
          </Tagline>
        </BrandColumn>

        <FooterColumn>
          <FooterHeading>{language === 'ko' ? '바로가기' : 'Navigation'}</FooterHeading>
          <FooterNavLink to="/">{t.home || 'Home'}</FooterNavLink>
          <FooterNavLink to="/about">{t.about || 'About'}</FooterNavLink>
          <FooterNavLink to="/events">{t.events || 'Events'}</FooterNavLink>
          <FooterNavLink to="/newsletter">{t.newsletter || 'Newsletter'}</FooterNavLink>
          <FooterNavLink to="/sponsors">{t.sponsors || 'Sponsors'}</FooterNavLink>
          <FooterNavLink to="/resources">{t.resources || 'Resources'}</FooterNavLink>
        </FooterColumn>

        <FooterColumn>
          <FooterHeading>{language === 'ko' ? '연락처' : 'Contact'}</FooterHeading>
          <ContactRow>
            <ContactLabel>Email</ContactLabel>
            <span>info@oktadenver.org</span>
          </ContactRow>
          <ContactRow>
            <ContactLabel>City</ContactLabel>
            <span>Denver, Colorado, USA</span>
          </ContactRow>
          <DonateLink
            href="https://www.zeffy.com/donation-form/donate-to-change-lives-1296"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.donation || 'Donate'} →
          </DonateLink>
        </FooterColumn>
      </FooterGrid>

      <Divider />
      <FooterBottom>
        <Copyright>© 2025 Denver Chapter, World-OKTA. All Rights Reserved.</Copyright>
        <WorldOktaLink href="https://www.world-okta.com" target="_blank" rel="noopener noreferrer">
          World-OKTA ↗
        </WorldOktaLink>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;

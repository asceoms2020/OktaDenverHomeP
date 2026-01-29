import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  TradingContainer,
  ContentWrapper,
  Title,
  Subtitle,
  IconWrapper,
  InfoText
} from '../styles/Trading.styles';

const Trading = () => {
  const { language } = useLanguage();
  const isKo = language === 'ko';

  return (
    <TradingContainer>
      <ContentWrapper>
        <IconWrapper>
          🤝
        </IconWrapper>
        <Title>{isKo ? '무역하기' : 'Trading'}</Title>
        <Subtitle>
          {isKo 
            ? '서비스 준비중입니다.' 
            : 'Service Coming Soon'}
        </Subtitle>
        <InfoText>
          {isKo 
            ? '더 나은 서비스를 위해 페이지를 준비하고 있습니다. 덴버 OKTA 회원들을 위한 특별한 무역 매칭 서비스를 기대해주세요.'
            : 'We are preparing this page for better service. Please look forward to our special trading matching service for OKTA Denver members.'}
        </InfoText>
      </ContentWrapper>
    </TradingContainer>
  );
};

export default Trading;

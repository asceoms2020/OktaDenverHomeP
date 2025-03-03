import React from 'react';
import {
  AboutContainer,
  Title,
  Content,
  ImageGrid,
  ImageContainer,
  Image,
  ImageCaption
} from '../styles/About.styles';

const About = () => {
  return (
    <AboutContainer>
      <Title>Okta Denver에 오신 것을 환영합니다</Title>
      <Content>
        <p>
          Okta Denver는 혁신적인 아이덴티티 및 접근 관리 솔루션을 제공하는 
          글로벌 기업 Okta의 덴버 지사입니다. 우리는 기업의 디지털 전환을 
          지원하고 안전한 사용자 인증 경험을 제공하는데 전념하고 있습니다.
        </p>
        
        <ImageGrid>
          <ImageContainer>
            <Image src="/images/denver-office1.jpg" alt="Okta 덴버 사무실 전경" />
            <ImageCaption>현대적인 Okta 덴버 사무실</ImageCaption>
          </ImageContainer>
          <ImageContainer>
            <Image src="/images/denver-team.jpg" alt="Okta 덴버 팀" />
            <ImageCaption>열정적인 Okta 덴버 팀</ImageCaption>
          </ImageContainer>
          <ImageContainer>
            <Image src="/images/denver-culture.jpg" alt="Okta 덴버 문화" />
            <ImageCaption>혁신적인 기업 문화</ImageCaption>
          </ImageContainer>
        </ImageGrid>

        <p>
          최첨단 시설을 갖춘 우리의 덴버 사무실에서는 열정적인 전문가들이 
          모여 혁신적인 솔루션을 개발하고 있습니다. 우리는 협력과 창의성을 
          중요시하며, 다양성과 포용성을 존중하는 문화를 만들어가고 있습니다.
        </p>
      </Content>
    </AboutContainer>
  );
};

export default About; 
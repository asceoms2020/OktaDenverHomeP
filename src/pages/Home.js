import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';
// 배경 이미지 import
import heroBg from '../assets/images/hero-bg.jpg';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section" style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                    url(${heroBg}) no-repeat center center`
      }}>
        <div className="hero-content">
          <h1 className="hero-title">Okta Denver란?</h1>
          <p className="hero-subtitle">
            하는 일?
          </p>
          <Link to="/volunteer" className="cta-button">더 알아보기</Link>
        </div>
      </section>
      
      <section className="about-section">
        <h2>우리는 누구인가요?</h2>
        <div className="about-content">
          <p>단체입니다.</p>
        </div>
      </section>

      <section className="projects-section">
        <h2>진행 중인 프로젝트</h2>
        <div className="project-grid">
          <div className="project-card">
            <img src="/images/project1.jpg" alt="해양 보호" />
            <h3>사업 소개</h3>
            <p>사업 위한 활동</p>
          </div>
          <div className="project-card">
          <img src="/images/project2.jpg" alt="숲 보호" />
            <h3>사업 소개</h3>
            <p>두번째 사업 프로젝트</p>
          </div>
          <div className="project-card">
          <img src="/images/project2.jpg" alt="숲 보호" />
            <h3>협력업체</h3>
            <p>협력업체 소개</p>
          </div>
          <div className="project-card">
          <img src="/images/project2.jpg" alt="숲 보호" />
            <h3>사업 소개</h3>
            <p>사업 위한 활동</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
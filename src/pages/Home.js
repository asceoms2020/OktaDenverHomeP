import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';
// 배경 이미지 import
import heroBg from '../assets/images/hero-bg.jpg';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section" style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)),
                    url(${heroBg}) no-repeat center center`
      }}>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Okta Denver</h1>
          <p className="hero-subtitle">
            OKTA DENVER 홈페이지 입니다.
          </p>
          <Link to="/products" className="shop-button">탐색하기</Link>
        </div>
      </section>
      
      <section className="featured-section">
        <div className="grid-container">
          <div className="card">
            <h2>OKTA DENVER 소개</h2>
            <p>OKTA DENVER 홈페이지 입니다.</p>
          </div>
          <div className="card">
            <h2>베스트셀러</h2>
            <p>고객들이 가장 사랑하는 제품을 확인하세요</p>
          </div>
          <div className="card">
            <h2>특별 할인</h2>
            <p>지금 특별한 가격으로 만나보세요</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
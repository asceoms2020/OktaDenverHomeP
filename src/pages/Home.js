import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';
// 배경 이미지 import
import heroBg from '../assets/images/hero-bg.jpg';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Home = () => {
  const { language } = useLanguage();
  const t = translations[language].home;

  return (
    <div className="home-container">
      <section className="hero-section" style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                    url(${heroBg}) no-repeat center center`
      }}>
        <div className="hero-content">
          <h1 className="hero-title">{t.title}</h1>
          <p className="hero-subtitle">
            {t.subtitle}
          </p>
          <Link to="/volunteer" className="cta-button">{t.ctaButton}</Link>
        </div>
      </section>
      
      <section className="about-section">
        <h2>{t.aboutTitle}</h2>
        <div className="about-content">
          <p>{t.aboutContent}</p>
        </div>
      </section>

      <section className="projects-section">
        <h2>{t.projectsTitle}</h2>
        <div className="project-grid">
          <div className="project-card">
            <img src="/images/project1.jpg" alt={t.projects.project1.title} />
            <h3>{t.projects.project1.title}</h3>
            <p>{t.projects.project1.description}</p>
          </div>
          <div className="project-card">
            <img src="/images/project2.jpg" alt={t.projects.project2.title} />
            <h3>{t.projects.project2.title}</h3>
            <p>{t.projects.project2.description}</p>
          </div>
          <div className="project-card">
            <img src="/images/project2.jpg" alt={t.projects.project3.title} />
            <h3>{t.projects.project3.title}</h3>
            <p>{t.projects.project3.description}</p>
          </div>
          <div className="project-card">
            <img src="/images/project2.jpg" alt={t.projects.project4.title} />
            <h3>{t.projects.project4.title}</h3>
            <p>{t.projects.project4.description}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
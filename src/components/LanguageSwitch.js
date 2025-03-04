import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import '../styles/components/LanguageSwitch.css';

const LanguageSwitch = () => {
  const { language, toggleLanguage } = useLanguage();
  const currentLang = translations[language].language;

  return (
    <div className="language-switch">
      <button onClick={toggleLanguage} className="language-button">
        {currentLang[language === 'ko' ? 'en' : 'ko']}
      </button>
    </div>
  );
};

export default LanguageSwitch; 
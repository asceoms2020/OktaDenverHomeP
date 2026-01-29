import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import '../styles/components/LanguageSwitch.css';

const LanguageSwitch = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="language-switch">
      <button onClick={toggleLanguage} className="language-button" aria-label="Switch Language">
        {language === 'ko' ? '🇺🇸' : '🇰🇷'}
      </button>
    </div>
  );
};

export default LanguageSwitch; 
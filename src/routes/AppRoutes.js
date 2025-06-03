import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header';
import Home from '../pages/Home';
import About from '../pages/About';
import Events from '../pages/Events';
import News from '../pages/News';

const AppRoutes = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes; 
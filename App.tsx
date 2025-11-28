import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import KitabList from './pages/KitabList';
import KitabReader from './pages/KitabReader';
import Videos from './pages/Videos';
import Articles from './pages/Articles';
import ArticleReader from './pages/ArticleReader';
import Settings from './pages/Settings';
import PrayerTimes from './pages/PrayerTimes';

const AppContent: React.FC = () => {
  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kitab" element={<KitabList />} />
          <Route path="/kitab/:id" element={<KitabReader />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/read" element={<ArticleReader />} />
          <Route path="/sholat" element={<PrayerTimes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navbar />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
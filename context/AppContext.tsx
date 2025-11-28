import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, Bookmark } from '../types';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  bookmarks: Bookmark[];
  addBookmark: (kitabId: string, verseIndex: number) => void;
  removeBookmark: (kitabId: string) => void;
  getBookmark: (kitabId: string) => Bookmark | undefined;
}

const defaultSettings: AppSettings = {
  showPegon: true,
  showLatin: true,
  showTranslation: true,
  fontSize: 3,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load settings from local storage if available
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('appBookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('appBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addBookmark = (kitabId: string, verseIndex: number) => {
    setBookmarks(prev => {
      // Remove existing bookmark for this kitab if exists, then add new one
      const filtered = prev.filter(b => b.kitabId !== kitabId);
      return [{ kitabId, verseIndex, timestamp: Date.now() }, ...filtered];
    });
  };

  const removeBookmark = (kitabId: string) => {
    setBookmarks(prev => prev.filter(b => b.kitabId !== kitabId));
  };

  const getBookmark = (kitabId: string) => {
    return bookmarks.find(b => b.kitabId === kitabId);
  };

  return (
    <AppContext.Provider value={{ settings, updateSettings, bookmarks, addBookmark, removeBookmark, getBookmark }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_KITABS } from '../constants';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Settings2, Bookmark, Check } from 'lucide-react';
import { AppSettings } from '../types';

// Helper component for Settings Modal inside Reader
const ReaderSettingsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}> = ({ isOpen, onClose, settings, updateSettings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Tampilan Baca</h3>
          <button onClick={onClose} className="text-sm text-primary-600 font-medium">Selesai</button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">Teks Pegon / Arab</span>
            <button 
              onClick={() => updateSettings({ showPegon: !settings.showPegon })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.showPegon ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.showPegon ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">Teks Latin</span>
             <button 
              onClick={() => updateSettings({ showLatin: !settings.showLatin })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.showLatin ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.showLatin ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">Terjemahan</span>
             <button 
              onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.showTranslation ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.showTranslation ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          
          <div className="pt-2">
            <span className="text-gray-700 block mb-2">Ukuran Font</span>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-primary-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
             <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Kecil</span>
              <span>Besar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KitabReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings, updateSettings, bookmarks, addBookmark } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);

  const kitab = MOCK_KITABS.find(k => k.id === id);
  const currentBookmark = bookmarks.find(b => b.kitabId === id);

  const verseRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to bookmark on load
  useEffect(() => {
    if (currentBookmark && verseRefs.current[currentBookmark.verseIndex]) {
      verseRefs.current[currentBookmark.verseIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveVerseIndex(currentBookmark.verseIndex);
    }
  }, [id]); // Run only on mount/id change to avoid jumping while reading

  if (!kitab) {
    return <div className="p-8 text-center">Kitab tidak ditemukan</div>;
  }

  const handleBookmark = (index: number) => {
    addBookmark(kitab.id, index);
    setActiveVerseIndex(index);
  };

  const getFontSizeClass = (level: number) => {
    switch(level) {
      case 1: return 'text-sm';
      case 2: return 'text-base';
      case 3: return 'text-lg'; // Default
      case 4: return 'text-xl';
      case 5: return 'text-2xl';
      default: return 'text-lg';
    }
  };

  const getArabicFontSizeClass = (level: number) => {
     switch(level) {
      case 1: return 'text-xl';
      case 2: return 'text-2xl';
      case 3: return 'text-3xl'; // Default
      case 4: return 'text-4xl';
      case 5: return 'text-5xl';
      default: return 'text-3xl';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between z-40 shadow-sm">
        <button onClick={() => navigate('/kitab')} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-gray-800 text-lg truncate flex-1 mx-4 text-center">{kitab.title}</h1>
        <button onClick={() => setShowSettings(true)} className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Settings2 size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 pb-32 pt-4 px-3 sm:px-6 max-w-3xl mx-auto w-full">
        {kitab.verses.map((verse, index) => {
          const isBookmarked = currentBookmark?.verseIndex === index;
          
          return (
            <div 
              key={verse.id}
              ref={el => { verseRefs.current[index] = el }}
              className={`
                mb-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden
                ${isBookmarked ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-transparent bg-white shadow-sm'}
              `}
            >
              {/* Verse Number & Bookmark Action */}
              <div className="absolute top-0 left-0 bottom-0 w-12 flex flex-col items-center py-4 bg-gray-50 border-r border-gray-100">
                <span className="font-bold text-gray-400 text-sm mb-4">{verse.id}</span>
                <button 
                  onClick={() => handleBookmark(index)}
                  className={`p-2 rounded-full transition-all ${isBookmarked ? 'text-primary-600 bg-white shadow-sm scale-110' : 'text-gray-300 hover:text-primary-400'}`}
                  aria-label="Bookmark"
                >
                   {isBookmarked ? <Check size={20} /> : <Bookmark size={20} />}
                </button>
              </div>

              {/* Text Content */}
              <div className="pl-16 pr-4 py-6 space-y-4">
                {/* Pegon / Arabic */}
                {settings.showPegon && (
                  <div 
                    className={`text-right font-arabic leading-loose text-gray-900 ${getArabicFontSizeClass(settings.fontSize)}`}
                    dangerouslySetInnerHTML={{ __html: verse.pegon }}
                  />
                )}

                {/* Latin */}
                {settings.showLatin && (
                  <div className={`text-left font-medium text-primary-700 italic ${getFontSizeClass(settings.fontSize)}`}>
                    {verse.latin}
                  </div>
                )}

                {/* Translation */}
                {settings.showTranslation && (
                  <div className={`text-left text-gray-600 ${getFontSizeClass(settings.fontSize)}`}>
                    {verse.translation}
                  </div>
                )}

                {/* Warning if everything is hidden */}
                {!settings.showPegon && !settings.showLatin && !settings.showTranslation && (
                  <p className="text-center text-gray-400 text-sm italic">Aktifkan tampilan teks di menu pengaturan</p>
                )}
              </div>
              
              {/* Swipe/Bookmark Hint (Visual Only) */}
              {isBookmarked && (
                <div className="bg-primary-600 text-white text-[10px] uppercase font-bold text-center py-1 tracking-widest">
                  Terakhir Dibaca
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ReaderSettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        settings={settings}
        updateSettings={updateSettings}
      />
    </div>
  );
};

export default KitabReader;
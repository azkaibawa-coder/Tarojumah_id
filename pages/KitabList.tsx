import React from 'react';
import { MOCK_KITABS } from '../constants';
import { Link } from 'react-router-dom';
import { Book, Bookmark as BookmarkIcon, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const KitabList: React.FC = () => {
  const { bookmarks } = useApp();

  return (
    <div className="pb-24 pt-6 px-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pustaka Kitab</h1>

      {/* Tabs / Sections */}
      <div className="space-y-8">
        
        {/* Bookmarks Section (Only if exists) */}
        {bookmarks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-primary-700">
              <BookmarkIcon size={20} />
              <h2 className="text-lg font-bold">Penanda Saya</h2>
            </div>
            <div className="grid gap-3">
              {bookmarks.map((bm) => {
                const kitab = MOCK_KITABS.find(k => k.id === bm.kitabId);
                if (!kitab) return null;
                return (
                  <Link key={bm.kitabId} to={`/kitab/${bm.kitabId}`} className="bg-white p-4 rounded-xl border border-primary-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-12 ${kitab.coverColor} rounded shadow-sm`}></div>
                       <div>
                         <h3 className="font-bold text-gray-800 text-sm">{kitab.title}</h3>
                         <p className="text-xs text-gray-500">Lanjut bait ke-{bm.verseIndex + 1}</p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* All Books Section */}
        <section>
           <div className="flex items-center gap-2 mb-3 text-gray-800">
              <Book size={20} />
              <h2 className="text-lg font-bold">Daftar Kitab</h2>
            </div>
            <div className="grid gap-4">
              {MOCK_KITABS.map((kitab) => (
                <Link to={`/kitab/${kitab.id}`} key={kitab.id} className="block group">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex gap-4">
                    {/* Book Cover Placeholder */}
                    <div className={`w-20 h-28 ${kitab.coverColor} rounded-lg shadow-md flex-shrink-0 flex items-center justify-center text-white/20`}>
                      <Book size={32} />
                    </div>
                    
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary-600 transition-colors">{kitab.title}</h3>
                      <p className="text-sm text-gray-600 italic mb-2">{kitab.author}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">{kitab.description}</p>
                      <div className="mt-3 flex items-center text-xs font-medium text-primary-600">
                        <span>Baca Sekarang</span>
                        <ChevronRight size={14} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default KitabList;
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_KITABS } from '../constants';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Moon, MapPin, ChevronRight, PlayCircle, Globe, Compass } from 'lucide-react';

const Home: React.FC = () => {
  const { bookmarks } = useApp();
  const lastRead = bookmarks.length > 0 ? bookmarks[0] : null;
  const lastReadKitab = lastRead ? MOCK_KITABS.find(k => k.id === lastRead.kitabId) : null;

  // Prayer Time Logic (Simplified for Home Widget)
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string} | null>(null);
  const [city, setCity] = useState("Jakarta");

  useEffect(() => {
    // Simple mock logic for immediate display. In real app, reuse PrayerTimes logic or context
    const getPrayerTimes = async () => {
      try {
        const date = new Date();
        // Default Jakarta
        const response = await fetch(`https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}?latitude=-6.2088&longitude=106.8456&method=20`);
        const data = await response.json();
        if(data.code === 200) {
           const timings = data.data.timings;
           // Determine next prayer (simple comparison)
           const now = new Date();
           const currentTime = now.getHours() * 60 + now.getMinutes();
           
           const prayers = [
             { name: 'Subuh', time: timings.Fajr },
             { name: 'Dzuhur', time: timings.Dhuhr },
             { name: 'Ashar', time: timings.Asr },
             { name: 'Maghrib', time: timings.Maghrib },
             { name: 'Isya', time: timings.Isha },
           ];

           for(let p of prayers) {
             const [h, m] = p.time.split(':').map(Number);
             if (h * 60 + m > currentTime) {
               setNextPrayer(p);
               return;
             }
           }
           setNextPrayer({ name: 'Subuh', time: timings.Fajr }); // Next day
        }
      } catch (e) {
        setNextPrayer({ name: 'Sholat', time: '--:--' });
      }
    };
    getPrayerTimes();
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="pb-24 pt-6 px-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-500 text-sm font-medium">{getTimeGreeting()}</p>
          <h1 className="text-2xl font-bold text-gray-800">Akhi Muslim</h1>
        </div>
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
          <Moon size={20} />
        </div>
      </div>

      {/* Prayer Times Widget (New) */}
      <Link to="/sholat" className="block bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-4 text-white shadow-lg mb-6 relative overflow-hidden group">
         <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-4"></div>
         <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-1 text-primary-100 text-xs mb-1">
                <MapPin size={12} /> {city}
              </div>
              <p className="text-xs opacity-90">Sholat Berikutnya</p>
              <h2 className="text-2xl font-bold font-mono">{nextPrayer ? nextPrayer.name : '...'} {nextPrayer ? nextPrayer.time : ''}</h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Clock size={24} />
              </div>
              <span className="text-[10px] flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full">
                Lihat Jadwal <ChevronRight size={10} />
              </span>
            </div>
         </div>
      </Link>

      {/* Hero / Daily Quote */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        <p className="text-primary-600 text-xs font-semibold uppercase tracking-wider mb-2">Ayat Hari Ini</p>
        <p className="text-xl font-arabic font-bold mb-3 leading-relaxed text-gray-800">فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا</p>
        <p className="text-sm text-gray-600 italic mb-4">"Karena sesungguhnya sesudah kesulitan itu ada kemudahan."</p>
        <p className="text-xs text-gray-400">QS. Al-Insyirah: 5</p>
      </div>

      {/* Last Read Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Terakhir Dibaca</h2>
          {lastRead && <Link to="/kitab" className="text-primary-600 text-sm font-medium">Lihat Semua</Link>}
        </div>

        {lastRead && lastReadKitab ? (
          <Link to={`/kitab/${lastReadKitab.id}`} className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-16 ${lastReadKitab.coverColor} rounded-md shadow-sm flex-shrink-0`}></div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{lastReadKitab.title}</h3>
                <p className="text-gray-500 text-sm mt-1">Bait ke-{lastRead.verseIndex + 1}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                  <BookOpen size={12} />
                  <span>Lanjutkan membaca</span>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-3">Belum ada riwayat bacaan.</p>
            <Link to="/kitab" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Mulai Membaca</Link>
          </div>
        )}
      </div>

      {/* Quick Menu */}
      <h2 className="text-lg font-bold text-gray-800 mb-3">Menu Cepat</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/videos" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <PlayCircle size={20} />
          </div>
          <span className="font-medium text-gray-700">Video Kajian</span>
        </Link>
        <Link to="/sholat" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <Compass size={20} />
          </div>
          <span className="font-medium text-gray-700">Arah Kiblat</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Compass, Loader2 } from 'lucide-react';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

interface PrayerSchedule {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
}

const PrayerTimes: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [prayers, setPrayers] = useState<PrayerSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [qiblaDirection, setQiblaDirection] = useState(0); // Degree relative to North
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Default Jakarta Coords if GPS fails
  const DEFAULT_LAT = -6.2088;
  const DEFAULT_LNG = 106.8456;

  useEffect(() => {
    // 1. Get Location
    getUserLocation();
    
    // 2. Setup Compass Listener
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const event = e as DeviceOrientationEventiOS;
      // alpha: 0 is North, 90 East, etc.
      if (event.webkitCompassHeading) {
        // iOS
        setDeviceHeading(event.webkitCompassHeading);
      } else if (event.alpha !== null && event.alpha !== undefined) {
        // Android / Standard
        setDeviceHeading(360 - event.alpha);
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  useEffect(() => {
    if (location) {
      fetchPrayerTimes(location.lat, location.lng);
      calculateQibla(location.lat, location.lng);
    }
  }, [location]);

  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocode simple (using API or just showing coords)
          // For simplicity/reliability without key, we use coords, or generic name
          setLocation({ lat: latitude, lng: longitude, name: "Lokasi Anda" });
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setError("Gagal mendeteksi lokasi. Menggunakan Jakarta.");
          setLocation({ lat: DEFAULT_LAT, lng: DEFAULT_LNG, name: "Jakarta (Default)" });
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation tidak didukung.");
      setLocation({ lat: DEFAULT_LAT, lng: DEFAULT_LNG, name: "Jakarta (Default)" });
      setLoading(false);
    }
  };

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    try {
      const date = new Date();
      const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      // Method 20 = Kemenag RI
      const response = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=20`);
      const data = await response.json();
      if (data.code === 200) {
        setPrayers(data.data.timings);
      }
    } catch (e) {
      console.error(e);
      setError("Gagal memuat jadwal sholat.");
    }
  };

  const calculateQibla = (lat: number, lng: number) => {
    // Kaaba coordinates
    const kaabaLat = 21.422487;
    const kaabaLng = 39.826206;

    const y = Math.sin(lng * Math.PI / 180 - kaabaLng * Math.PI / 180);
    const x = Math.cos(lat * Math.PI / 180) * Math.tan(kaabaLat * Math.PI / 180) - Math.sin(lat * Math.PI / 180) * Math.cos(lng * Math.PI / 180 - kaabaLng * Math.PI / 180);
    let qibla = Math.atan2(y, x) * 180 / Math.PI;
    
    // Qibla direction relative to North (Clockwise)
    // Formula result is relative to North, but we need to adjust standard compass logic
    // Actually standard Great Circle formula gives bearing.
    // Let's use a simpler known formula for Qibla bearing
    
    const dLon = (kaabaLng - lng) * Math.PI / 180;
    const lat1 = lat * Math.PI / 180;
    const lat2 = kaabaLat * Math.PI / 180;

    const y2 = Math.sin(dLon) * Math.cos(lat2);
    const x2 = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let brng = Math.atan2(y2, x2) * 180 / Math.PI;
    
    setQiblaDirection((brng + 360) % 360);
  };

  const PrayerItem = ({ name, time, icon }: { name: string, time: string, icon?: React.ReactNode }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="font-medium text-gray-600">{name}</span>
      <span className="font-bold text-gray-800 font-mono text-lg">{time}</span>
    </div>
  );

  return (
    <div className="pb-24 pt-6 px-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Jadwal Sholat & Kiblat</h1>
      
      {/* Location Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 p-2 rounded-full text-primary-600">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Lokasi Terdeteksi</p>
            <p className="font-bold text-gray-800">{loading ? 'Mencari...' : location?.name}</p>
          </div>
        </div>
        <button onClick={getUserLocation} className="text-sm text-primary-600 font-medium">
          Update
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Prayer Schedule */}
      <div className="bg-white rounded-xl shadow-lg border border-primary-100 overflow-hidden mb-8">
        <div className="bg-primary-600 p-4 text-white text-center">
           <h2 className="font-bold">Jadwal Hari Ini</h2>
           <p className="text-primary-100 text-sm">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="p-4">
          {!prayers ? (
             <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary-600" /></div>
          ) : (
            <>
              <PrayerItem name="Subuh" time={prayers.Fajr} />
              <PrayerItem name="Terbit" time={prayers.Sunrise} />
              <PrayerItem name="Dzuhur" time={prayers.Dhuhr} />
              <PrayerItem name="Ashar" time={prayers.Asr} />
              <PrayerItem name="Maghrib" time={prayers.Maghrib} />
              <PrayerItem name="Isya" time={prayers.Isha} />
            </>
          )}
        </div>
      </div>

      {/* Qibla Compass */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Compass size={20} /> Arah Kiblat
        </h3>
        
        {/* Compass Circle */}
        <div className="relative w-48 h-48 rounded-full border-4 border-gray-200 flex items-center justify-center mb-4 bg-gray-50">
           {/* Static North Marker */}
           <div className="absolute top-2 text-gray-400 font-bold text-xs">U</div>
           
           {/* Rotating Container based on device heading to simulate compass */}
           <div 
             className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
             style={{ transform: `rotate(${-deviceHeading}deg)` }}
           >
              {/* Qibla Indicator (Fixed relative to North) */}
              <div 
                className="absolute w-1 h-24 bg-transparent top-1/2 left-1/2 origin-top -translate-x-1/2"
                style={{ transform: `rotate(${qiblaDirection + 180}deg)` }}
              >
                 <div className="w-full h-full flex flex-col items-center justify-end">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse text-white text-[10px] font-bold z-10">
                      🕋
                    </div>
                    <div className="w-1 h-12 bg-green-500/50"></div>
                 </div>
              </div>

               {/* North Needle */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-24 bg-red-500 origin-bottom"></div>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-24 bg-gray-400 origin-top"></div>
           </div>
        </div>
        
        <p className="text-xs text-gray-500 max-w-[250px]">
          Pastikan GPS aktif dan kalibrasi kompas HP Anda dengan membuat gerakan angka 8. Arah Ka'bah ditunjukkan oleh ikon 🕋.
        </p>
        <p className="text-xs text-primary-600 mt-2 font-mono">
           Qibla: {qiblaDirection.toFixed(1)}° | Kompas: {deviceHeading.toFixed(1)}°
        </p>
      </div>
    </div>
  );
};

export default PrayerTimes;
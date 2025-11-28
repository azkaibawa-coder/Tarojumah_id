import React, { useEffect, useState } from 'react';
import { fetchPlaylists, fetchVideosByPlaylist } from '../utils/youtubeHelper';
import { Video, Playlist } from '../types';
import { Play, Loader2, RefreshCw, ListVideo, ArrowLeft, Youtube, AlertCircle } from 'lucide-react';

const Videos: React.FC = () => {
  // Mode: 'list' (Daftar Playlist) atau 'detail' (Daftar Video dalam Playlist)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistVideos, setPlaylistVideos] = useState<Video[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Playlists saat pertama kali buka
  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlaylists();
      setPlaylists(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat playlist.");
    } finally {
      setLoading(false);
    }
  };

  const openPlaylist = async (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setLoading(true);
    setError(null);
    setViewMode('detail');
    
    try {
      // Fetch video di dalam playlist ini
      const videos = await fetchVideosByPlaylist(playlist.id);
      setPlaylistVideos(videos);
    } catch (err: any) {
      setError(err.message || "Gagal memuat video.");
    } finally {
      setLoading(false);
    }
  };

  const backToPlaylists = () => {
    setViewMode('list');
    setSelectedPlaylist(null);
    setPlaylistVideos([]);
    setError(null);
  };

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="pb-24 pt-6 px-4 min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {viewMode === 'detail' && (
             <button onClick={backToPlaylists} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={24} />
             </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {viewMode === 'list' ? 'Koleksi Kajian' : selectedPlaylist?.title}
            </h1>
            {viewMode === 'list' && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Youtube size={12} className="text-red-600"/> Nabawi TV
              </p>
            )}
          </div>
        </div>
        
        {viewMode === 'list' && (
          <button onClick={loadPlaylists} className="p-2 text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-bold mb-1">Terjadi Kesalahan</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Konten */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p>{viewMode === 'list' ? 'Memuat Playlist...' : 'Memuat Video...'}</p>
        </div>
      ) : (
        <>
          {/* Tampilan List Playlist */}
          {viewMode === 'list' && !error && (
            <div className="grid gap-4">
              {playlists.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <p>Tidak ada playlist ditemukan.</p>
                  <p className="text-xs mt-2">Periksa koneksi internet atau API Key.</p>
                </div>
              ) : (
                playlists.map((playlist) => (
                  <div 
                    key={playlist.id} 
                    onClick={() => openPlaylist(playlist)}
                    className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer flex gap-4 group"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-auto bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0">
                      <img src={playlist.thumbnail} alt={playlist.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-2 py-1 rounded-tl-lg flex items-center gap-1">
                        <ListVideo size={10} /> {playlist.itemCount} Video
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center py-1">
                       <h3 className="font-bold text-gray-800 leading-tight mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                         {playlist.title}
                       </h3>
                       <p className="text-xs text-gray-500">{playlist.channel}</p>
                       <div className="mt-3 text-xs font-medium text-primary-600">
                         Buka Playlist &rarr;
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tampilan Detail Video dalam Playlist */}
          {viewMode === 'detail' && !error && (
             <div className="grid gap-4">
               {playlistVideos.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p>Tidak ada video di playlist ini.</p>
                  </div>
               ) : (
                 playlistVideos.map((video) => (
                    <div 
                      key={video.id} 
                      onClick={() => handleVideoClick(video.id)}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all flex flex-col sm:flex-row"
                    >
                      <div className="relative aspect-video sm:w-40 bg-gray-200">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center pl-1 shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play size={20} className="text-red-600" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                           <h3 className="font-bold text-gray-800 text-sm mb-1 leading-snug line-clamp-2">{video.title}</h3>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1"><Youtube size={12} /> Tonton</span>
                          <span>{video.views}</span>
                        </div>
                      </div>
                    </div>
                 ))
               )}
             </div>
          )}
        </>
      )}
    </div>
  );
};

export default Videos;
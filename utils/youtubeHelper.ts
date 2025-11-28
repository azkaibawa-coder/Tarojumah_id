
import { Video, Playlist } from '../types';
import { YOUTUBE_CHANNELS } from '../data/youtube_channels';

// ==========================================
// KONFIGURASI API YOUTUBE
// ==========================================
// API Key dari user
const YOUTUBE_API_KEY = 'AIzaSyCV1ojoEUKpCmSoVyRn-PuF7cN8PLvuMs4'; 
// ==========================================

// ID Channel Nabawi TV (Bisa berupa ID 'UC...' atau Handle '@...')
const TARGET_ID_OR_HANDLE = YOUTUBE_CHANNELS[0].id;

// Cache untuk menyimpan Channel ID yang sudah di-resolve agar hemat API call
let cachedChannelId: string | null = null;

// Helper untuk mendapatkan Channel ID dari Handle (misal: @nabawitv -> UC...)
const resolveChannelId = async (idOrHandle: string): Promise<string> => {
  // Jika sudah ada di cache, pakai itu
  if (cachedChannelId) return cachedChannelId;

  // Jika bukan handle (tidak mulai dengan @), asumsikan itu sudah Channel ID
  if (!idOrHandle.startsWith('@')) {
    cachedChannelId = idOrHandle;
    return idOrHandle;
  }

  // Jika handle, cari ID aslinya via API
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(idOrHandle)}&key=${YOUTUBE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
     throw new Error(data.error.message || "Gagal resolve channel handle");
  }

  if (data.items && data.items.length > 0) {
    cachedChannelId = data.items[0].id;
    return cachedChannelId!;
  }

  throw new Error(`Channel dengan handle ${idOrHandle} tidak ditemukan.`);
};

export const fetchPlaylists = async (): Promise<Playlist[]> => {
  if (!YOUTUBE_API_KEY) {
    throw new Error("API Key YouTube belum disetting di utils/youtubeHelper.ts");
  }

  try {
    // 1. Dapatkan Channel ID yang valid (convert dari handle jika perlu)
    const channelId = await resolveChannelId(TARGET_ID_OR_HANDLE);

    // 2. Fetch Playlist menggunakan Channel ID
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=20&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      console.error("YouTube API Error Details:", JSON.stringify(data.error, null, 2));
      throw new Error(data.error.message || "Terjadi kesalahan pada YouTube API");
    }

    if (data.items) {
      return data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        itemCount: item.contentDetails.itemCount,
        channel: item.snippet.channelTitle
      }));
    }
    
    return [];
  } catch (error: any) {
    console.error("Gagal mengambil playlist:", error);
    throw new Error(error.message || "Gagal menghubungi YouTube");
  }
};

export const fetchVideosByPlaylist = async (playlistId: string): Promise<Video[]> => {
  if (!YOUTUBE_API_KEY) return [];

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=20&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
       console.error("YouTube API Error Details:", JSON.stringify(data.error, null, 2));
       throw new Error(data.error.message || "Terjadi kesalahan pada YouTube API");
    }

    if (data.items) {
      return data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channel: item.snippet.channelTitle,
        views: new Date(item.snippet.publishedAt).toLocaleDateString('id-ID'),
        description: item.snippet.description
      })).filter((v: Video) => v.title !== 'Private video');
    }
    return [];
  } catch (error: any) {
    console.error("Gagal mengambil video playlist:", error);
    throw new Error(error.message || "Gagal memuat video");
  }
};

// Legacy function (optional)
export const fetchLatestVideos = async (): Promise<Video[]> => {
  return []; 
};

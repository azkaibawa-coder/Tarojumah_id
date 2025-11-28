
import React, { useEffect, useState } from 'react';
import { Article } from '../types';
import { FALLBACK_ARTICLES } from '../constants';
import { Loader2, RefreshCw, ChevronRight, Globe, FileText, ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Komponen Thumbnail yang aman (Anti-Blank)
const ArticleThumbnail = ({ src, alt }: { src: string | null, alt: string }) => {
  const [error, setError] = useState(false);

  // Jika tidak ada URL sumber atau terjadi error saat load gambar
  if (!src || error) {
    return (
      <div className="w-full h-full bg-primary-50 flex flex-col items-center justify-center text-primary-300 border border-primary-100">
        <FileText size={32} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Helper function untuk mengekstrak gambar dengan lebih robust
  const extractImage = (item: any): string | null => {
    // 1. Cek properti thumbnail/enclosure dari rss2json
    if (item.thumbnail && item.thumbnail.match(/^https?:\/\//)) return item.thumbnail;
    if (item.enclosure?.link && item.enclosure.type?.startsWith('image')) return item.enclosure.link;

    // 2. Cari gambar dalam konten HTML (description atau content)
    // Gabungkan konten untuk pencarian menyeluruh
    const htmlContent = (item.content || '') + (item.description || '');
    
    if (htmlContent) {
      try {
        // Metode 1: DOMParser (Paling akurat)
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const img = doc.querySelector('img');
        // Validasi src pastikan http/https
        if (img && img.src && img.src.match(/^https?:\/\//)) {
          return img.src;
        }
      } catch (e) {
        console.warn("DOMParser failed, fallback to Regex");
      }

      // Metode 2: Regex (Backup jika DOMParser gagal parsing struktur aneh)
      const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1] && imgMatch[1].match(/^https?:\/\//)) {
        return imgMatch[1];
      }
    }

    // 3. Jika tidak ada gambar, kembalikan null (akan dirender sebagai Ikon Placeholder)
    return null;
  };

  const fetchArticles = async () => {
    setLoading(true);
    setError(false);
    try {
      // Menggunakan RSS feed Rifaiyah via rss2json
      // Tambahkan parameter t untuk cache busting
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://rifaiyah.or.id/feed/&t=${Date.now()}`);
      const data = await response.json();

      if (data.status === 'ok') {
        const formattedArticles: Article[] = data.items.map((item: any) => {
          const image = extractImage(item);
          
          return {
            id: item.link, 
            title: item.title,
            excerpt: item.description, 
            source: 'rifaiyah.or.id',
            image: image || '', // String kosong jika null
            date: new Date(item.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        });
        setArticles(formattedArticles);
      } else {
        throw new Error('Gagal mengambil data');
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setArticles(FALLBACK_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openArticleReader = (article: Article) => {
    navigate(`/articles/read`, { state: { article } });
  };

  return (
    <div className="pb-24 pt-6 px-4 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Artikel Rifaiyah</h1>
        <button onClick={fetchArticles} className="p-2 text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-2" />
          <p>Memuat artikel...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              Gagal memuat artikel terbaru. Menampilkan data tersimpan.
            </div>
          )}
          
          {articles.map((article, index) => (
            <article 
              key={`${article.id}-${index}`}
              onClick={() => openArticleReader(article)}
              className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex gap-4 cursor-pointer group h-32"
            >
               {/* Thumbnail Container */}
               <div className="w-24 h-full flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                 <ArticleThumbnail src={article.image} alt={article.title} />
               </div>
               
               {/* Content */}
               <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                 <div>
                   <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight mb-2 line-clamp-2" title={article.title}>
                     {article.title}
                   </h3>
                   <div 
                      className="text-xs text-gray-500 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: article.excerpt.replace(/<[^>]+>/g, '').substring(0, 100) + '...' }} 
                   />
                 </div>
                 <div className="flex justify-between items-center mt-2 text-[10px] sm:text-xs text-gray-400">
                   <span className="text-primary-600 font-medium truncate max-w-[100px]">{article.source}</span>
                   <span className="flex items-center gap-1 flex-shrink-0">
                      Baca <ChevronRight size={12} />
                   </span>
                 </div>
               </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;

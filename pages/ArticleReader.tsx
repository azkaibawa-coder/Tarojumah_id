import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Globe } from 'lucide-react';
import { Article } from '../types';

const ArticleReader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    // We pass the article object via state when navigating
    if (location.state && location.state.article) {
      setArticle(location.state.article);
    } else {
      // If accessed directly without state, go back
      navigate('/articles');
    }
  }, [location, navigate]);

  if (!article) return null;

  return (
    <div className="min-h-screen bg-white pb-safe">
      {/* Navbar */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between z-40">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
           <button 
             onClick={() => window.open(article.id, '_blank')}
             className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
             title="Buka di Browser"
           >
            <Globe size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-64 bg-gray-200 relative">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-5 py-6 -mt-6 relative bg-white rounded-t-3xl shadow-sm min-h-[50vh]">
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded font-medium">{article.source}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-6 font-serif">
          {article.title}
        </h1>

        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
           {/* In a real app, we would sanitize this HTML. For now, we trust the RSS source description */}
           {/* If the description is short, we display it. If it's a full content feed, it works great. */}
           <div dangerouslySetInnerHTML={{ __html: article.excerpt.replace(/\.\.\.$/, '') }} />
           
           <hr className="my-8 border-gray-100" />
           
           <div className="bg-gray-50 p-6 rounded-xl text-center">
             <p className="text-gray-600 mb-4 text-sm">Ini adalah pratinjau artikel. Baca selengkapnya di website asli.</p>
             <button 
               onClick={() => window.open(article.id, '_blank')}
               className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors"
             >
               Baca Artikel Lengkap <Globe size={16} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleReader;
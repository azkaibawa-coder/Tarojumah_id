import { Kitab, Article } from './types';
import { KITAB_REGISTRY } from './data/kitab_registry';

export const MOCK_KITABS: Kitab[] = KITAB_REGISTRY;

// Default article fallback if fetch fails
export const FALLBACK_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'Selamat Datang di Aplikasi',
    excerpt: 'Silahkan hubungkan ke internet untuk memuat artikel terbaru dari Rifaiyah.or.id',
    source: 'System',
    image: 'https://rifaiyah.or.id/wp-content/uploads/2021/08/cropped-logo-rifaiyah-1.png',
    date: 'Hari ini'
  }
];
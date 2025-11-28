export interface Verse {
  id: number;
  pegon: string;
  latin: string;
  translation: string;
}

export interface Kitab {
  id: string;
  title: string;
  author: string;
  description: string;
  verses: Verse[];
  coverColor: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: string;
}

export interface Playlist {
  id: string;
  title: string;
  thumbnail: string;
  itemCount: number;
  channel: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  image: string;
  date: string;
}

export interface AppSettings {
  showPegon: boolean;
  showLatin: boolean;
  showTranslation: boolean;
  fontSize: number; // 1 to 5 scale
}

export interface Bookmark {
  kitabId: string;
  verseIndex: number;
  timestamp: number;
}
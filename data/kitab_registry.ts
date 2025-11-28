
// FILE INI UNTUK MENDAFTARKAN KITAB
// Import file kitab yang sudah dibuat di folder kitabs
import { TABYANAL_ISLAH } from './kitabs/tabyanal';
import { HUSNUL_MITHALAB } from './kitabs/husnul_mithalab';
import { RIAYATAL_HIMMAH_AWAL } from './kitabs/riayatal_himmah_awal';
import { RIAYATAL_HIMMAH_AKHIR } from './kitabs/riayatal_himmah_akhir';
import { ABYANAL_HAWAIJ } from './kitabs/abyanal_hawaij';

// Masukkan ke dalam list ini agar muncul di aplikasi
// Urutan di sini menentukan urutan tampilan di halaman List Kitab
export const KITAB_REGISTRY = [
  TABYANAL_ISLAH,
  HUSNUL_MITHALAB,
  RIAYATAL_HIMMAH_AWAL,
  RIAYATAL_HIMMAH_AKHIR,
  ABYANAL_HAWAIJ
];

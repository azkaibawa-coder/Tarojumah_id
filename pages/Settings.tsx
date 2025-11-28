import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Bell, Shield, Moon, Type, ChevronRight, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-colors relative ${active ? 'bg-primary-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : ''}`} />
    </button>
  );

  return (
    <div className="pb-24 pt-6 px-4 min-h-screen bg-gray-50">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Akhi Hamba Allah</h1>
          <p className="text-sm text-gray-500">user@example.com</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Preference Section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Preferensi Baca Kitab</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
             <div className="p-4 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Type size={18} /></div>
                 <span className="font-medium text-gray-700">Tampilkan Pegon</span>
               </div>
               <Toggle active={settings.showPegon} onToggle={() => updateSettings({ showPegon: !settings.showPegon })} />
             </div>
             <div className="p-4 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Type size={18} className="italic" /></div>
                 <span className="font-medium text-gray-700">Tampilkan Latin</span>
               </div>
               <Toggle active={settings.showLatin} onToggle={() => updateSettings({ showLatin: !settings.showLatin })} />
             </div>
             <div className="p-4 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Type size={18} /></div>
                 <span className="font-medium text-gray-700">Tampilkan Arti</span>
               </div>
               <Toggle active={settings.showTranslation} onToggle={() => updateSettings({ showTranslation: !settings.showTranslation })} />
             </div>
          </div>
        </section>

        {/* General Section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Umum</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Moon size={18} /></div>
                 <span className="font-medium text-gray-700">Mode Gelap</span>
               </div>
               <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Segera</span>
            </button>
            <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Bell size={18} /></div>
                 <span className="font-medium text-gray-700">Notifikasi</span>
               </div>
               <ChevronRight size={18} className="text-gray-300" />
            </button>
             <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Shield size={18} /></div>
                 <span className="font-medium text-gray-700">Kebijakan Privasi</span>
               </div>
               <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        </section>

        <button className="w-full bg-red-50 text-red-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-red-100 transition-colors">
          <LogOut size={20} />
          <span>Keluar Aplikasi</span>
        </button>

         <p className="text-center text-xs text-gray-400 mt-6">Version 1.0.0 (Beta)</p>
      </div>
    </div>
  );
};

export default Settings;
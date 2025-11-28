import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, PlayCircle, Globe, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/articles', icon: Globe, label: 'Artikel' }, // Changed from Sholat to Artikel
    { to: '/kitab', icon: BookOpen, label: '', primary: true },
    { to: '/videos', icon: PlayCircle, label: 'Video' },
    { to: '/settings', icon: User, label: 'Seting' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-end h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex flex-col items-center justify-center w-full h-full pb-2 transition-colors duration-200
                ${isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`
                    ${item.primary ? 'mb-6 bg-primary-600 text-white p-3 rounded-full shadow-lg border-4 border-white transform translate-y-2' : 'mb-1'}
                    ${isActive && !item.primary ? 'transform scale-110' : ''}
                    transition-all duration-200
                  `}>
                    <Icon size={item.primary ? 28 : 22} strokeWidth={item.primary ? 2.5 : 2} className={item.primary ? 'text-white' : ''} />
                  </div>
                  {!item.primary && (
                    <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
                  )}
                  {item.primary && (
                    <span className="text-[10px] font-medium tracking-tight text-primary-700 absolute bottom-1">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
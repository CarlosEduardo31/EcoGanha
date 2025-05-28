// src/components/layout/BottomNavigation.tsx

import React from 'react';
import { UserTabType } from '@/types/comum';

interface BottomNavigationProps {
  activeTab: UserTabType;
  onTabChange: (tab: UserTabType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-2 py-3 flex justify-around items-center">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center w-1/5 ${activeTab === 'home' ? 'text-[#003F25]' : 'text-gray-500'}`}
      >
        <div className={`p-2 rounded-full mb-1 ${activeTab === 'home' ? 'bg-[#FBCA27]' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <span className="text-xs">Início</span>
      </button>
      
      <button 
        onClick={() => onTabChange('rewards')}
        className={`flex flex-col items-center justify-center w-1/5 ${activeTab === 'rewards' ? 'text-[#003F25]' : 'text-gray-500'}`}
      >
        <div className={`p-2 rounded-full mb-1 ${activeTab === 'rewards' ? 'bg-[#FBCA27]' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-xs">Prêmios</span>
      </button>
      
      <button 
        onClick={() => onTabChange('map')}
        className={`flex flex-col items-center justify-center w-1/5 ${activeTab === 'map' ? 'text-[#003F25]' : 'text-gray-500'}`}
      >
        <div className={`p-2 rounded-full mb-1 ${activeTab === 'map' ? 'bg-[#FBCA27]' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="text-xs">Mapa</span>
      </button>
      
      <button 
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center justify-center w-1/5 ${activeTab === 'profile' ? 'text-[#003F25]' : 'text-gray-500'}`}
      >
       <div className={`p-2 rounded-full mb-1 ${activeTab === 'profile' ? 'bg-[#FBCA27]' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="text-xs">Perfil</span>
      </button>
    </div>
  );
};

export default BottomNavigation;
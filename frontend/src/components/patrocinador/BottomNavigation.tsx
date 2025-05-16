import React from 'react';
import { SponsorTabType } from '@/types/patrocinador';

interface BottomNavigationProps {
  activeTab: SponsorTabType;
  onTabChange: (tab: SponsorTabType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-2 py-3 flex justify-around items-center">
      <button 
        onClick={() => onTabChange('search')}
        className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'search' ? 'text-[#003F25]' : 'text-gray-500'}`}
      >
        <div className={`p-2 rounded-full ${activeTab === 'search' ? 'bg-[#FBCA27]' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span className="text-xs mt-1">Resgatar</span>
      </button>
      
      <button 
        onClick={() => onTabChange('history')}
        className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'history' ? 'text-[#003F25]' : 'text-gray-500'}`}
      >
        <div className={`p-2 rounded-full ${activeTab === 'history' ? 'bg-[#FBCA27]' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-xs mt-1">Histórico</span>
      </button>
      
      <button 
        onClick={() => onTabChange('offers')}
        className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'offers' ? 'text-[#003F25]' : 'text-gray-500'}`}
      >
        <div className={`p-2 rounded-full ${activeTab === 'offers' ? 'bg-[#FBCA27]' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <span className="text-xs mt-1">Ofertas</span>
      </button>
      
      <button 
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'profile' ? 'text-[#003F25]' : 'text-gray-500'}`}
      >
       <div className={`p-2 rounded-full ${activeTab === 'profile' ? 'bg-[#FBCA27]' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="text-xs mt-1">Perfil</span>
      </button>
    </div>
  );
};

export default BottomNavigation;
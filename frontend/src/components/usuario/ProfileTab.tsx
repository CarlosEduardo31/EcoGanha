import React from 'react';
import Image from 'next/image';
import { User } from '@/contexts/AuthContext';
import { TabType } from '@/types/interfaces';

interface ProfileTabProps {
  user: User;
  onTabChange: (tab: TabType) => void;
  onLogout: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, onTabChange, onLogout }) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center">
            <Image
              src={"/IconPerfil.svg"}
              alt="Perfil"
              width={100}
              height={100}
              className="w-24 h-24"
            />
          </div>
          <h1 className="text-[#003E25] font-semibold text-xl mt-2">{user.name}</h1>
          <p className="text-gray-500">{user.phone}</p>
          <div className="bg-[#FBCA27] rounded-full px-4 py-1 inline-block mt-2">
            <p className="text-[#003F25] font-bold">{user.points} EcoPontos</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="text-[#003F25] font-semibold mb-3">Preferências</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Notificações</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003F25]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Receber novidades por email</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003F25]"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-[#003F25] font-semibold mb-3">Históricos</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => onTabChange('activities')} 
                className="w-full flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span>Histórico de Reciclagem</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                onClick={() => onTabChange('redemptions')} 
                className="w-full flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-[#f8efc2] p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FBCA27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Prêmios Resgatados</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-[#003F25] font-semibold mb-3">Sobre</h2>
            <p className="text-sm text-gray-600">
              O EcoGanha é uma iniciativa para tornar Caruaru mais sustentável durante o São João, oferecendo pontos por reciclagem que podem ser trocados por descontos e prêmios.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <button 
              onClick={onLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 mt-2"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
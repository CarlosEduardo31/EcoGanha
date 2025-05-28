// src/components/usuario/HomeTab.tsx

import React from 'react';
import Image from 'next/image';
import { User } from '@/contexts/AuthContext';
import { Partner, RecycleTransaction, SelectedPartner, UserTabType } from '@/types/comum';

interface HomeTabProps {
  user: User;
  recycleHistory: RecycleTransaction[];
  partners: Partner[];
  onTabChange: (tab: UserTabType) => void;
  setSelectedPartner: (partner: SelectedPartner) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const HomeTab: React.FC<HomeTabProps> = ({ 
  user, 
  recycleHistory, 
  partners, 
  onTabChange, 
  setSelectedPartner 
}) => {
  return (
    <>
      {/* Perfil e pontos */}
      <div className="bg-[#FBCA27] rounded-lg p-4 shadow-md mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mt-2">
            <div className="relative">
              <Image
                src={"/IconPerfil.svg"}
                alt="Perfil"
                width={80}
                height={80}
                className="w-20 h-20"
              />
              <span className="absolute bottom-0 right-0 bg-[#003F25] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                1
              </span>
            </div>
          </div>
          <h1 className="text-[#003E25] font-semibold text-xl mt-2">{user.name}</h1>
          <div className="bg-white rounded-full px-4 py-2 inline-block mt-2 shadow-sm">
            <p className="text-[#003F25] font-bold">{user.points} EcoPontos</p>
          </div>
        </div>
      </div>

      {/* Histórico de Atividades */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#003F25] font-semibold text-lg">Suas Atividades</h2>
          <button 
            className="text-sm text-[#003F25] hover:underline"
            onClick={() => onTabChange('activities')}
          >
            Ver todas
          </button>
        </div>
        <div className="space-y-3">
          {recycleHistory.length > 0 ? (
            <>
              {recycleHistory.slice(0, 2).map(activity => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Reciclagem de {activity.materialName}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(activity.date)} • {activity.ecoPointName}
                      </p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">+{Number(activity.points) || 0} pontos</span>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                Nenhuma atividade registrada ainda.
              </p>
              <p className="text-gray-500 text-sm">
                Visite um Eco Ponto para reciclar e ganhar pontos!
              </p>
              <button 
                onClick={() => onTabChange('map')}
                className="mt-3 bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition-colors text-sm"
              >
                Encontrar Eco Pontos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards de Destaques */}
      <div className="mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-3">Resumo</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#FBCA27]">
            <div className="text-2xl font-bold text-[#003F25] mb-1">{user.points}</div>
            <div className="text-sm text-gray-600">Pontos acumulados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-[#003F25] mb-1">{recycleHistory.length}</div>
            <div className="text-sm text-gray-600">Itens reciclados</div>
          </div>
        </div>
      </div>

      {/* Ofertas em Destaque */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#003F25] font-semibold text-lg">Ofertas em Destaque</h2>
          <button 
            className="text-sm text-[#003F25] hover:underline"
            onClick={() => onTabChange('rewards')}
          >
            Ver todas
          </button>
        </div>
        
        {partners.length > 0 ? (
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-4 w-max">
              {partners.slice(0, 3).map(partner => (
                <div key={partner.id} className="bg-gray-50 rounded-lg p-3 min-w-[200px] border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    {partner.logo ? (
                      <Image 
                        src={partner.logo} 
                        alt={partner.name} 
                        width={32} 
                        height={32}
                        className="w-8 h-8 mr-2 rounded"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-[#FBCA27] rounded mr-2 flex items-center justify-center">
                        <span className="text-[#003F25] text-sm font-bold">
                          {partner.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="font-medium text-sm">{partner.name}</h3>
                  </div>
                  {partner.offers && partner.offers.length > 0 && (
                    <>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {partner.offers[0].title}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#003F25] font-medium text-sm">
                          {Number(partner.offers[0].points) || 0} pontos
                        </span>
                        <button 
                          onClick={() => {
                            setSelectedPartner({
                              ...partner,
                              location: partner.location || "Stand do São João, Pátio de Eventos"
                            });
                            onTabChange('rewards');
                          }}
                          className="bg-[#003F25] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#002918] transition-colors"
                        >
                          Ver mais
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              Nenhuma oferta disponível no momento.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default HomeTab;
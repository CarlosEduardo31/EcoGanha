import React from 'react';
import Image from 'next/image';
import { mockPartners, mockRecycleHistory } from '@/data/mockData';
import { User } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/materialUtils';
import { SelectedPartner, TabType } from '@/types/interfaces';

interface HomeTabProps {
  user: User;
  onTabChange: (tab: TabType) => void;
  setSelectedPartner: (partner: SelectedPartner) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ user, onTabChange, setSelectedPartner }) => {
  // Filtrar apenas o histórico do usuário atual
  const userRecycleHistory = mockRecycleHistory.filter(history => history.userId === user.id);

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
          <div className="bg-white rounded-full px-4 py-1 inline-block mt-2 shadow-sm">
            <p className="text-[#003F25] font-bold">{user.points} EcoPontos</p>
          </div>
        </div>
      </div>

      {/* Histórico de Atividades */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#003F25] font-semibold text-lg">Suas Atividades</h2>
          <button 
            className="text-sm text-[#003F25]"
            onClick={() => onTabChange('activities')}
          >
            Ver todas
          </button>
        </div>
        <div className="space-y-3">
          {userRecycleHistory.length > 0 ? (
            <>
              {userRecycleHistory.slice(0, 2).map(activity => (
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
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">+{activity.points} pontos</span>
                </div>
              ))}
            </>
          ) : (
            <p className="text-center py-4 text-gray-500">
              Nenhuma atividade registrada ainda. Visite um Eco Ponto para reciclar e ganhar pontos!
            </p>
          )}
        </div>
      </div>

      {/* Cards de Destaques */}
      <div className="mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-3">Destaques</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#FBCA27]">
            <div className="text-3xl font-bold text-[#003F25] mb-2">{user.points}</div>
            <div className="text-sm text-gray-600">Pontos acumulados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-[#003F25] mb-2">{userRecycleHistory.length}</div>
            <div className="text-sm text-gray-600">Itens reciclados</div>
          </div>
        </div>
      </div>

      {/* Próximos Descontos Disponíveis */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[#003F25] font-semibold text-lg">Ofertas em Destaque</h2>
          <button 
            className="text-sm text-[#003F25]"
            onClick={() => onTabChange('rewards')}
          >
            Ver mais
          </button>
        </div>
        
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex space-x-4 w-max">
            {mockPartners.map(partner => (
              <div key={partner.id} className="bg-gray-50 rounded-lg p-3 min-w-[200px] border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Image 
                    src={partner.logo} 
                    alt={partner.name} 
                    width={40} 
                    height={40}
                    className="mr-2"
                  />
                  <h3 className="font-medium">{partner.name}</h3>
                </div>
                {partner.offers && partner.offers.length > 0 && (
                  <>
                    <p className="text-sm text-gray-600 mb-2">{partner.offers[0].title}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#003F25] font-medium">{partner.offers[0].points} pontos</span>
                      <button 
                        onClick={() => {
                          setSelectedPartner({
                            ...partner,
                            location: "Stand do São João, Pátio de Eventos"
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
      </div>
    </>
  );
};

export default HomeTab;
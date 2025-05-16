import React from 'react';
import { mockRecycleHistory, mockEcoPoints } from '@/data/mockData';
import { User } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/materialUtils';
import { TabType } from '@/types/interfaces';

interface ActivitiesTabProps {
  user: User;
  onTabChange: (tab: TabType) => void;
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ user, onTabChange }) => {
  // Filtrar apenas o histórico do usuário atual
  const userRecycleHistory = mockRecycleHistory.filter(history => history.userId === user.id);

  // Função para obter nome do eco ponto pelo ID
  const getEcoPointName = (ecoPointId: string): string => {
    const ecoPoint = mockEcoPoints.find(point => point.id === ecoPointId);
    return ecoPoint ? ecoPoint.name : "Eco Ponto";
  };

  return (
    <div>
      <div className="mb-4">
        <button 
          onClick={() => onTabChange('profile')}
          className="flex items-center text-[#003F25] mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para o perfil
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-[#003F25] font-semibold text-lg mb-4">Histórico de Reciclagem</h2>
          
          {userRecycleHistory.length > 0 ? (
            <div className="space-y-4">
              {userRecycleHistory.map(activity => (
                <div key={activity.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Reciclagem de {activity.materialName}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(activity.date)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Local: {getEcoPointName(activity.ecoPointId)}
                        </p>
                        <div className="mt-2 flex">
                          <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 mr-2">
                            Peso: {activity.weight} kg
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 font-medium">
                      +{activity.points} pontos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma reciclagem ainda</h3>
              <p className="text-gray-500">
                Visite um Eco Ponto para começar a reciclar e ganhar pontos!
              </p>
              <button 
                onClick={() => onTabChange('map')}
                className="mt-4 bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition-colors"
              >
                Encontrar Eco Pontos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesTab;
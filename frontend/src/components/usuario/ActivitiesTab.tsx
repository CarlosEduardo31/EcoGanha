// src/components/usuario/ActivitiesTab.tsx

import React from 'react';
import { User } from '@/contexts/AuthContext';
import { RecycleTransaction, UserTabType } from '@/types/comum';

interface ActivitiesTabProps {
  user: User;
  recycleHistory: RecycleTransaction[];
  onTabChange: (tab: UserTabType) => void;
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

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ 
  user, 
  recycleHistory, 
  onTabChange 
}) => {
  return (
    <div>
      <div className="mb-4">
        <button 
          onClick={() => onTabChange('profile')}
          className="flex items-center text-[#003F25] mb-4 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para o perfil
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-[#003F25] font-semibold text-lg mb-4">Histórico de Reciclagem</h2>
          
          {recycleHistory.length > 0 ? (
            <div className="space-y-4">
              {recycleHistory.map(activity => (
                <div key={activity.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Reciclagem de {activity.materialName}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(activity.date)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Local: {activity.ecoPointName}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                            Peso: {Number(activity.weight) || 0} kg
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 font-medium">
                      +{Number(activity.points) || 0} pontos
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
              <p className="text-gray-500 mb-4">
                Visite um Eco Ponto para começar a reciclar e ganhar pontos!
              </p>
              <button 
                onClick={() => onTabChange('map')}
                className="bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition-colors"
              >
                Encontrar Eco Pontos
              </button>
            </div>
          )}
        </div>

        {/* Estatísticas do usuário */}
        {recycleHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-[#003F25] font-semibold text-lg mb-4">Suas Estatísticas</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-500">Total de Pontos Ganhos</p>
                <p className="text-xl font-bold text-[#003F25]">
                  {recycleHistory.reduce((sum, item) => sum + (Number(item.points) || 0), 0)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-500">Material Reciclado (kg)</p>
                <p className="text-xl font-bold text-[#003F25]">
                  {recycleHistory.reduce((sum, item) => sum + (Number(item.weight) || 0), 0).toFixed(1)}
                </p>
              </div>
            </div>

            {/* Materiais mais reciclados */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-700 mb-3">Materiais mais reciclados</h4>
              {(() => {
                const materialStats = recycleHistory.reduce((acc, item) => {
                  const weight = Number(item.weight) || 0;
                  acc[item.materialName] = (acc[item.materialName] || 0) + weight;
                  return acc;
                }, {} as Record<string, number>);
                
                const sortedMaterials = Object.entries(materialStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3);

                return sortedMaterials.length > 0 ? (
                  <div className="space-y-2">
                    {sortedMaterials.map(([material, weight], index) => (
                      <div key={material} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex items-center">
                          <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center mr-2 ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{material}</span>
                        </div>
                        <span className="text-sm text-gray-600">{weight.toFixed(1)} kg</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesTab;
// src/components/usuario/RedemptionsTab.tsx

import React from 'react';
import { User } from '@/contexts/AuthContext';
import { RedemptionTransaction, UserTabType } from '@/types/comum';

interface RedemptionsTabProps {
  user: User;
  redemptionHistory: RedemptionTransaction[];
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

const RedemptionsTab: React.FC<RedemptionsTabProps> = ({ 
  user, 
  redemptionHistory, 
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
          <h2 className="text-[#003F25] font-semibold text-lg mb-4">Prêmios Resgatados</h2>
          
          {redemptionHistory.length > 0 ? (
            <div className="space-y-4">
              {redemptionHistory.map(redemption => (
                <div key={redemption.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-[#f8efc2] p-2 rounded-full mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FBCA27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">{redemption.title}</h3>
                        {redemption.description && (
                          <p className="text-sm text-gray-600 mt-1">{redemption.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(redemption.date)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Parceiro: {redemption.partnerName}
                        </p>
                      </div>
                    </div>
                    <div className="text-[#003F25] font-medium">
                      -{redemption.points} pontos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum prêmio resgatado</h3>
              <p className="text-gray-500 mb-4">
                Visite um parceiro para resgatar seus pontos!
              </p>
              <button 
                onClick={() => onTabChange('rewards')}
                className="bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition-colors"
              >
                Ver Prêmios Disponíveis
              </button>
            </div>
          )}
        </div>

        {/* Estatísticas de resgates */}
        {redemptionHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-[#003F25] font-semibold text-lg mb-4">Estatísticas de Resgates</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-500">Total de Pontos Gastos</p>
                <p className="text-xl font-bold text-[#003F25]">
                  {redemptionHistory.reduce((sum, item) => sum + item.points, 0)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-500">Prêmios Resgatados</p>
                <p className="text-xl font-bold text-[#003F25]">
                  {redemptionHistory.length}
                </p>
              </div>
            </div>

            {/* Parceiros mais utilizados */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-700 mb-3">Parceiros mais utilizados</h4>
              {(() => {
                const partnerStats = redemptionHistory.reduce((acc, item) => {
                  acc[item.partnerName] = (acc[item.partnerName] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const sortedPartners = Object.entries(partnerStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3);

                return sortedPartners.length > 0 ? (
                  <div className="space-y-2">
                    {sortedPartners.map(([partner, count], index) => (
                      <div key={partner} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex items-center">
                          <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center mr-2 ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{partner}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {count} resgate{count > 1 ? 's' : ''}
                        </span>
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

export default RedemptionsTab;
import React from 'react';
import { mockRedemptionHistory } from '@/data/mockData';
import { User } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/materialUtils';
import { TabType } from '@/types/interfaces';

interface RedemptionsTabProps {
  user: User;
  onTabChange: (tab: TabType) => void;
}

const RedemptionsTab: React.FC<RedemptionsTabProps> = ({ user, onTabChange }) => {
  // Filtrar apenas o histórico do usuário atual
  const userRedemptionHistory = mockRedemptionHistory.filter(history => history.userId === user.id);

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
          <h2 className="text-[#003F25] font-semibold text-lg mb-4">Prêmios Resgatados</h2>
          
          {userRedemptionHistory.length > 0 ? (
            <div className="space-y-4">
              {userRedemptionHistory.map(redemption => (
                <div key={redemption.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-[#f8efc2] p-2 rounded-full mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FBCA27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">{redemption.prize}</h3>
                        <p className="text-sm text-gray-500">
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
              <p className="text-gray-500">
                Visite um parceiro para resgatar seus pontos!
              </p>
              <button 
                onClick={() => onTabChange('rewards')}
                className="mt-4 bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition-colors"
              >
                Ver Prêmios Disponíveis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedemptionsTab;
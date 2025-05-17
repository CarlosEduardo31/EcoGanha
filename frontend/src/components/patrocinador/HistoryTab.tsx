import React from 'react';

interface HistoryTabProps {
  redemptions: any[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({ redemptions }) => {
  // Função para formatar data
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Histórico de Resgates</h2>
      
      {redemptions.length === 0 ? (
        <p className="text-center py-4 text-gray-500">
          Nenhum resgate registrado ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {redemptions.map((redemption) => (
            <div key={redemption.id} className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{redemption.userName}</p>
                  <p className="text-sm text-gray-500">{redemption.offerTitle}</p>
                  <p className="text-xs text-gray-400">{formatDate(redemption.date)}</p>
                </div>
              </div>
              <span className="text-blue-600 font-medium">-{redemption.points} pontos</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
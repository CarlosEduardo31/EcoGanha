import React from 'react';
import { Transaction } from '@/types/ecoponto';
import { formatDate } from '@/utils/materialUtils';

interface HistoryTabProps {
  transactions: Transaction[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Histórico de Transações</h2>
      
      {transactions.length === 0 ? (
        <p className="text-center py-4 text-gray-500">
          Nenhuma transação registrada ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="border-b pb-3 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{transaction.userName}</p>
                    <p className="text-sm text-gray-500">{transaction.userPhone}</p>
                  </div>
                </div>
                <span className="text-green-600 font-medium">+{transaction.points} pontos</span>
              </div>
              <div className="ml-12 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Material:</span> {transaction.material}
                </div>
                <div>
                  <span className="text-gray-500">Peso:</span> {transaction.weight}kg
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Data:</span> {formatDate(transaction.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
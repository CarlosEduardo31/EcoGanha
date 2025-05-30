import React from 'react';
import { Transaction } from '@/types/ecoponto';

interface StatsData {
  totalRecycledToday: string;
  pointsDistributed: number;
  usersServed: number;
  mostRecycledMaterial: string;
  materialDistribution: {
    name: string;
    percentage: number;
    color: string;
  }[];
}

interface StatsTabProps {
  transactions: Transaction[];
  statsData: StatsData;
}

const StatsTab: React.FC<StatsTabProps> = ({ statsData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Estatísticas de Reciclagem</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Reciclado Hoje</p>
          <p className="text-2xl font-bold text-[#003F25]">{statsData.totalRecycledToday} kg</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Pontos Distribuídos</p>
          <p className="text-2xl font-bold text-[#003F25]">{statsData.pointsDistributed}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Usuários Atendidos</p>
          <p className="text-2xl font-bold text-[#003F25]">{statsData.usersServed}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Material Mais Reciclado</p>
          <p className="text-2xl font-bold text-[#003F25]">{statsData.mostRecycledMaterial}</p>
        </div>
      </div>
      
      <h3 className="text-[#003F25] font-semibold mb-3">Distribuição por Material</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        {/* Gráfico simplificado */}
        <div className="space-y-3">
          {statsData.materialDistribution.map((material, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{material.name}</span>
                <span className="text-sm font-medium">{material.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`${material.color} h-2.5 rounded-full`} 
                  style={{ width: `${material.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
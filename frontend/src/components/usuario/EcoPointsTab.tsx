import React from 'react';
import { mockEcoPoints } from '@/data/mockData';
import { getMaterialName } from '@/utils/materialUtils';
import { TabType } from '@/types/interfaces';

interface EcoPointsTabProps {
  onTabChange: (tab: TabType) => void;
}

const EcoPointsTab: React.FC<EcoPointsTabProps> = ({ onTabChange }) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-4">Eco Pontos Próximos</h2>
        
        {/* Mapa (placeholder) */}
        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
          <p className="text-gray-500">Mapa dos Eco Pontos</p>
        </div>
        
        <div className="space-y-4 mt-4">
          {mockEcoPoints.map(ecoPoint => (
            <div key={ecoPoint.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-[#003F25]">{ecoPoint.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{ecoPoint.address}</p>
              <p className="text-sm text-gray-600 mt-1">Horário: {ecoPoint.openingHours}</p>
              <div className="mt-3 bg-[#f0f9f6] p-3 rounded-md">
                <h4 className="text-sm font-medium text-[#003F25] mb-2">Materiais aceitos:</h4>
                <div className="flex flex-wrap gap-2">
                  {ecoPoint.materials.map((material, index) => (
                    <span key={index} className="bg-green-100 text-[#003F25] text-xs px-2 py-1 rounded-full">
                      {getMaterialName(material)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <button className="bg-[#003F25] text-white text-xs px-3 py-1.5 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ver no mapa
                </button>
                <button className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Ligar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcoPointsTab;
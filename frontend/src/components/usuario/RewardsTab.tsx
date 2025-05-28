// src/components/usuario/RewardsTab.tsx

import React from 'react';
import Image from 'next/image';
import { User } from '@/contexts/AuthContext';
import { Partner, SelectedPartner, UserTabType } from '@/types/comum';

interface RewardsTabProps {
  user: User;
  partners: Partner[];
  selectedPartner: SelectedPartner | null;
  setSelectedPartner: (partner: SelectedPartner | null) => void;
  onTabChange: (tab: UserTabType) => void;
}

const RewardsTab: React.FC<RewardsTabProps> = ({ 
  user, 
  partners,
  selectedPartner, 
  setSelectedPartner, 
  onTabChange 
}) => {
  return (
    <div>
      {selectedPartner ? (
        <div className="mb-4">
          <button 
            onClick={() => setSelectedPartner(null)}
            className="flex items-center text-[#003F25] mb-4 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para todos os parceiros
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center mb-4">
              {selectedPartner.logo ? (
                <Image 
                  src={selectedPartner.logo} 
                  alt={selectedPartner.name} 
                  width={60} 
                  height={60}
                  className="mr-4 rounded"
                />
              ) : (
                <div className="w-15 h-15 bg-[#FBCA27] rounded mr-4 flex items-center justify-center">
                  <span className="text-[#003F25] text-2xl font-bold">
                    {selectedPartner.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-[#003F25]">{selectedPartner.name}</h2>
                <p className="text-gray-600 text-sm">Parceiro oficial do EcoGanha</p>
              </div>
            </div>
            
            <div className="bg-[#f0f9f6] rounded-lg p-3 mb-4 border border-green-100">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#003F25] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="font-medium text-[#003F25]">Localização do Stand</h3>
                  <p className="text-sm">{selectedPartner.location}</p>
                  <button 
                    onClick={() => onTabChange('map')}
                    className="mt-2 text-sm text-[#003F25] font-medium underline flex items-center hover:no-underline"
                  >
                    Ver no mapa
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-[#003F25] mb-3">Prêmios Disponíveis</h3>
            
            <div className="space-y-4">
              {selectedPartner.offers && selectedPartner.offers.length > 0 ? (
                selectedPartner.offers.map(offer => (
                  <div key={offer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-[#003F25]">{offer.title}</h4>
                        {offer.description && (
                          <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                        )}
                        {offer.validUntil && (
                          <p className="text-xs text-gray-500 mt-1">
                            Válido até: {new Date(offer.validUntil).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                      <div className="bg-[#FBCA27] px-3 py-1 rounded-full text-sm font-medium text-[#003F25] ml-3">
                        {Number(offer.points) || 0} pontos
                      </div>
                    </div>
                    
                    <div className={`py-2 px-3 rounded-md text-center text-sm mb-3 ${
                      user.points >= (Number(offer.points) || 0)
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.points >= (Number(offer.points) || 0)
                        ? `✓ Você tem pontos suficientes (${user.points}/${Number(offer.points) || 0})` 
                        : `Faltam ${(Number(offer.points) || 0) - user.points} pontos para resgatar`}
                    </div>
                    
                    <div className="text-sm text-[#003F25] bg-[#f0f9f6] p-3 rounded-md">
                      <p className="font-medium mb-1">Como resgatar:</p>
                      <p>Visite o stand da {selectedPartner.name} e apresente seu perfil no app para o atendente resgatar este prêmio.</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Nenhuma oferta disponível no momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-[#003F25] font-semibold text-lg mb-4">Todos os Parceiros</h2>
          
          {partners.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {partners.map(partner => (
                <div key={partner.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    {partner.logo ? (
                      <Image 
                        src={partner.logo} 
                        alt={partner.name} 
                        width={48} 
                        height={48}
                        className="mr-3 rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#FBCA27] rounded mr-3 flex items-center justify-center">
                        <span className="text-[#003F25] text-lg font-bold">
                          {partner.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{partner.name}</h3>
                      <p className="text-sm text-gray-600">
                        {partner.location || "Stand do São João, Pátio de Eventos"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">Parceiro oficial do EcoGanha</p>
                    {partner.offers && partner.offers.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        A partir de {Math.min(...partner.offers.map(o => Number(o.points) || 0))} pontos
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <span className="text-sm text-gray-600">
                        {partner.offers?.length || 0} prêmio{(partner.offers?.length || 0) !== 1 ? 's' : ''} disponível{(partner.offers?.length || 0) !== 1 ? 'eis' : ''}
                      </span>
                    </div>
                    <button 
                      onClick={() => setSelectedPartner({
                        ...partner,
                        location: partner.location || "Stand do São João, Pátio de Eventos"
                      })}
                      className="bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition-colors text-sm flex items-center"
                    >
                      Ver detalhes
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
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
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum parceiro disponível</h3>
              <p className="text-gray-500">
                Os parceiros aparecerão aqui quando houver ofertas disponíveis.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RewardsTab;
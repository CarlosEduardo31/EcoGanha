// src/components/patrocinador/SearchTab.tsx

import React from 'react';
import { UserData, Offer } from '@/types/patrocinador';

interface SearchTabProps {
  searchPhone: string;
  setSearchPhone: (phone: string) => void;
  foundUser: UserData | null;
  loading: boolean;
  error: string;
  success: string;
  offers: Offer[];
  selectedOffer: string;
  setSelectedOffer: (offer: string) => void;
  onSearch: () => Promise<void>;
  onRedeemPoints: () => Promise<void>;
}

const SearchTab: React.FC<SearchTabProps> = ({
  searchPhone,
  setSearchPhone,
  foundUser,
  loading,
  error,
  success,
  offers,
  selectedOffer,
  setSelectedOffer,
  onSearch,
  onRedeemPoints
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Buscar Cliente</h2>
      
      <div className="flex mb-4">
        <input
          type="tel"
          placeholder="Número de telefone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
        />
        <button
          onClick={onSearch}
          disabled={loading}
          className="bg-[#003F25] text-white px-4 py-2 rounded-r-md hover:bg-[#002918] transition duration-200 flex items-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {foundUser && (
        <div className="border border-gray-200 rounded-md p-4 mb-4">
          <div className="flex items-center mb-4">
            <div className="bg-[#FBCA27] p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#003F25]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{foundUser.name}</p>
              <p className="text-sm text-gray-500">{foundUser.phone}</p>
            </div>
            <div className="ml-auto">
              <p className="font-medium text-[#003F25]">{foundUser.points} pontos</p>
            </div>
          </div>

          <h3 className="text-[#003F25] font-semibold mb-2">Ofertas Disponíveis para Resgate</h3>
          
          <div className="mb-4">
            <div className="space-y-2">
              {offers.map((offer) => (
                <div 
                  key={offer.id} 
                  className={`border rounded-md p-3 cursor-pointer transition-colors ${
                    selectedOffer === offer.id 
                      ? 'border-[#003F25] bg-green-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedOffer(offer.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{offer.title}</h4>
                      <p className="text-sm text-gray-500">{offer.description}</p>
                    </div>
                    <div className="text-[#003F25] font-semibold">
                      {offer.points} pontos
                    </div>
                  </div>
                </div>
              ))}

              {offers.length === 0 && (
                <p className="text-center py-4 text-gray-500">
                  Nenhuma oferta disponível. Por favor, adicione ofertas na aba Ofertas.
                </p>
              )}
            </div>
          </div>

          {selectedOffer && (
            <div className="bg-gray-100 p-3 rounded-md mb-4">
              <p className="text-center font-medium">
                Pontos a resgatar: <span className="text-[#003F25]">
                  {offers.find(o => o.id === selectedOffer)?.points || 0}
                </span>
              </p>
            </div>
          )}

          <button
            onClick={onRedeemPoints}
            disabled={loading || !selectedOffer}
            className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Confirmar Resgate'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchTab;
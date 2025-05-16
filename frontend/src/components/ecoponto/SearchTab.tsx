import React, { useState } from 'react';
import { UserData, Material } from '@/types/ecoponto';
import { User } from '@/contexts/AuthContext';

interface SearchTabProps {
  materials: Material[];
  recentUsers: UserData[];
  loading: boolean;
  error: string;
  success: string;
  onSearchUser: (phone: string) => Promise<void>;
  onSelectRecentUser: (user: UserData) => void;
  onAddPoints: () => Promise<void>;
  foundUser: UserData | null;
  searchPhone: string;
  setSearchPhone: (phone: string) => void;
  selectedMaterial: string;
  setSelectedMaterial: (material: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  calculatePoints: () => number;
}

const SearchTab: React.FC<SearchTabProps> = ({
  materials,
  recentUsers,
  loading,
  error,
  success,
  onSearchUser,
  onSelectRecentUser,
  onAddPoints,
  foundUser,
  searchPhone,
  setSearchPhone,
  selectedMaterial,
  setSelectedMaterial,
  weight,
  setWeight,
  calculatePoints
}) => {
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchUser(searchPhone);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-4">Buscar Usuário</h2>
        
        <form onSubmit={handleSearch}>
          <div className="flex mb-4">
            <input
              type="tel"
              placeholder="Número de telefone"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
            />
            <button
              type="submit"
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
        </form>

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

        {/* Usuários recentes */}
        {recentUsers.length > 0 && !foundUser && (
          <div className="mt-4">
            <h3 className="text-gray-600 font-medium text-sm mb-2">Usuários recentes:</h3>
            <div className="space-y-2">
              {recentUsers.map(recentUser => (
                <div 
                  key={recentUser.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => onSelectRecentUser(recentUser)}
                >
                  <div className="flex items-center">
                    <div className="bg-[#FBCA27] p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#003F25]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{recentUser.name}</p>
                      <p className="text-sm text-gray-500">{recentUser.phone}</p>
                    </div>
                  </div>
                  <span className="text-[#003F25] font-medium">{recentUser.points} pontos</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {foundUser && (
          <div className="border border-gray-200 rounded-md p-4 mb-4 mt-4 bg-gray-50">
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

            <h3 className="text-[#003F25] font-semibold mb-2">Adicionar Pontos por Reciclagem</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Material Reciclável</label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
              >
                <option value="">Selecione um material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} ({material.pointsPerKg} pontos/kg)
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Peso em kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
              />
            </div>

            {selectedMaterial && weight && parseFloat(weight) > 0 && (
              <div className="bg-gray-100 p-3 rounded-md mb-4">
                <p className="text-center font-medium">
                  Pontos a adicionar: <span className="text-[#003F25]">{calculatePoints()}</span>
                </p>
              </div>
            )}

            <button
              onClick={onAddPoints}
              disabled={loading || !selectedMaterial || !weight}
              className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Confirmar Reciclagem
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchTab;
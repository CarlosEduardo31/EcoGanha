"use client"
// src/app/dashboard/patrocinador/page.tsx
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PatrocinadorDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchPhone, setSearchPhone] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const router = useRouter();

  // Ofertas disponíveis do patrocinador
  const offers = [
    { 
      id: '1', 
      title: '20% de desconto em qualquer produto', 
      description: 'Válido para compras acima de R$100',
      points: 500 
    },
    { 
      id: '2', 
      title: 'Cupom de R$15', 
      description: 'Válido para compras acima de R$30',
      points: 300 
    },
    { 
      id: '3', 
      title: '10% de desconto em frutas e verduras', 
      description: 'Válido uma vez por semana',
      points: 400 
    },
  ];

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.userType !== 'patrocinador') {
      // Redirecionar para o dashboard apropriado
      router.push(`/dashboard/${user?.userType}`);
    }
  }, [isAuthenticated, user, router]);

  // Simulação de busca de usuário pelo telefone
  const handleSearch = () => {
    if (!searchPhone || searchPhone.length < 10) {
      setError('Digite um número de telefone válido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setFoundUser(null);
    setSelectedOffer('');

    // Simular uma busca com atraso
    setTimeout(() => {
      // Dados mockados para simulação
      const mockUsers = [
        { id: '1', name: 'Maria da Silva', phone: '81999999999', userType: 'comum', points: 150 },
        { id: '4', name: 'Vandilma Candido', phone: '81666666666', userType: 'comum', points: 2000 },
      ];
      
      const found = mockUsers.find(u => u.phone === searchPhone);
      
      if (found && found.userType === 'comum') {
        setFoundUser(found);
      } else {
        setError('Usuário não encontrado ou não é um usuário comum');
      }
      
      setLoading(false);
    }, 1000);
  };

  // Simular resgate de pontos
  const handleRedeemPoints = () => {
    if (!foundUser) {
      setError('Nenhum usuário selecionado');
      return;
    }

    if (!selectedOffer) {
      setError('Selecione uma oferta');
      return;
    }

    const offer = offers.find(o => o.id === selectedOffer);
    if (!offer) {
      setError('Oferta inválida');
      return;
    }

    if (foundUser.points < offer.points) {
      setError(`Pontos insuficientes. O usuário tem ${foundUser.points} pontos, mas a oferta requer ${offer.points} pontos.`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    // Simular operação com atraso
    setTimeout(() => {
      setSuccess(`Resgate bem-sucedido! ${offer.points} pontos foram descontados do usuário ${foundUser.name}.`);
      
      // Atualizar os pontos do usuário encontrado
      setFoundUser({
        ...foundUser,
        points: foundUser.points - offer.points
      });
      
      setLoading(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 mb-16">
      {/* Cabeçalho do patrocinador */}
      <div className="bg-[#FBCA27] rounded-lg p-4 shadow-md mb-6">
        <h1 className="text-[#003F25] text-xl font-bold text-center">Parceiro</h1>
        <p className="text-center text-[#003F25]">Estabelecimento: {user.name}</p>
      </div>

      {/* Busca de usuário */}
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
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#003F25] text-white px-4 py-2 rounded-r-md hover:bg-[#002918] transition duration-200"
          >
            {loading ? 'Buscando...' : 'Buscar'}
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
              onClick={handleRedeemPoints}
              disabled={loading || !selectedOffer}
              className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : 'Confirmar Resgate'}
            </button>
          </div>
        )}
      </div>

      {/* Histórico de transações */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-[#003F25] font-semibold text-lg mb-2">Últimos Resgates</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Maria da Silva</p>
                <p className="text-sm text-gray-500">20% de desconto em qualquer produto</p>
              </div>
            </div>
            <span className="text-blue-600 font-medium">-500 pontos</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Vandilma Candido</p>
                <p className="text-sm text-gray-500">Cupom de R$15</p>
              </div>
            </div>
            <span className="text-blue-600 font-medium">-300 pontos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
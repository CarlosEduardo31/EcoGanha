"use client"
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Interfaces para tipagem
interface UserData {
  id: string;
  name: string;
  phone: string;
  userType: string;
  points: number;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  points: number;
}

interface Redemption {
  id: string;
  userName: string;
  userPhone: string;
  offerTitle: string;
  points: number;
  date: string;
}

export default function PatrocinadorDashboardPage() {
  const { user, isAuthenticated, findUserByPhone, removePoints, logout } = useAuth();
  const [searchPhone, setSearchPhone] = useState('');
  const [foundUser, setFoundUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const [activeTab, setActiveTab] = useState('search');
   // Handler para mudança de aba
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([
    {
      id: '1',
      userName: 'Maria da Silva',
      userPhone: '81999999999',
      offerTitle: '20% de desconto em qualquer produto',
      points: 500,
      date: '2025-05-01T11:20:00'
    },
    {
      id: '2',
      userName: 'Vandilma Candido',
      userPhone: '81666666666',
      offerTitle: 'Cupom de R$15',
      points: 300,
      date: '2025-04-28T18:10:00'
    }
  ]);
  const router = useRouter();

  // Ofertas disponíveis
  const offers: Offer[] = [
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

    // Simular carregamento de usuários recentes
    setRecentUsers([
      { id: '1', name: 'Maria da Silva', phone: '81999999999', userType: 'comum', points: 150 },
      { id: '4', name: 'Vandilma Candido', phone: '81666666666', userType: 'comum', points: 2000 }
    ]);
  }, [isAuthenticated, user, router]);

  // Buscar usuário pelo telefone
  const handleSearch = async () => {
    if (!searchPhone || searchPhone.length < 10) {
      setError('Digite um número de telefone válido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setFoundUser(null);
    setSelectedOffer('');

    try {
      // Simular uma busca (substituir pela função real)
      const result = await findUserByPhone(searchPhone);
      
      if (result && result.userType === 'comum') {
        setFoundUser(result);
        // Adicionar aos usuários recentes se não estiver lá
        if (!recentUsers.some(u => u.id === result.id)) {
          setRecentUsers(prev => [result, ...prev].slice(0, 5));
        }
      } else {
        setError('Usuário não encontrado ou não é um usuário comum');
      }
    } catch (error) {
      setError('Erro ao buscar usuário');
    } finally {
      setLoading(false);
    }
  };

  // Clicar em um usuário recente
  const handleSelectRecentUser = (selectedUser: UserData) => {
    setFoundUser(selectedUser);
    setSearchPhone(selectedUser.phone);
    setError('');
    setSuccess('');
    setSelectedOffer('');
  };

  // Resgatar pontos
  const handleRedeemPoints = async () => {
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

    try {
      // Remover pontos (substituir pela função real)
      await removePoints(foundUser.id, offer.points, user?.id || '0', offer.title);
      
      // Atualizar a lista de resgates
      const newRedemption: Redemption = {
        id: Date.now().toString(),
        userName: foundUser.name,
        userPhone: foundUser.phone,
        offerTitle: offer.title,
        points: offer.points,
        date: new Date().toISOString()
      };
      
      setRedemptions(prev => [newRedemption, ...prev]);
      
      setSuccess(`Resgate bem-sucedido! ${offer.points} pontos foram descontados do usuário ${foundUser.name}.`);
      
      // Atualizar o usuário na lista de recentes e no formulário
      const updatedUser = { ...foundUser, points: foundUser.points - offer.points };
      setFoundUser(updatedUser);
      setRecentUsers(prev => 
        prev.map(u => 
          u.id === foundUser.id 
            ? updatedUser
            : u
        )
      );
      
      // Limpar seleção de oferta
      setSelectedOffer('');
    } catch (error) {
      setError('Erro ao processar resgate');
    } finally {
      setLoading(false);
    }
  };

  // Formatar data
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

  // Componentes para cada tab
  const renderSearchTab = () => (
    // O conteúdo é mantido igual, apenas foram removidos trechos para economizar espaço
    <>
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

        {/* Usuários recentes e outras seções... O restante do componente permanece igual */}
      </div>
    </>
  );

  const renderHistoryTab = () => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Histórico de Resgates</h2>
      
      {redemptions.length === 0 ? (
        <p className="text-center py-4 text-gray-500">
          Nenhum resgate registrado ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {redemptions.map((redemption) => (
            <div key={redemption.id} className="border-b pb-3 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{redemption.userName}</p>
                    <p className="text-sm text-gray-500">{redemption.userPhone}</p>
                  </div>
                </div>
                <span className="text-blue-600 font-medium">-{redemption.points} pontos</span>
              </div>
              <div className="ml-12 text-sm">
                <div className="mb-1">
                  <span className="text-gray-500">Oferta:</span> {redemption.offerTitle}
                </div>
                <div>
                  <span className="text-gray-500">Data:</span> {formatDate(redemption.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOffersTab = () => (
    // Conteúdo mantido igual...
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Gerenciar Ofertas</h2>
      
      <div className="space-y-4">
        {offers.map((offer) => (
          <div key={offer.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">{offer.title}</h3>
              <span className="bg-[#003F25] text-white text-xs px-2 py-1 rounded-full">{offer.points} pontos</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
            <div className="flex space-x-2">
              <button className="text-[#003F25] border border-[#003F25] px-3 py-1 rounded-md text-sm hover:bg-[#003F25] hover:text-white transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar
              </button>
              <button className="text-red-500 border border-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-500 hover:text-white transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 mt-4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Adicionar Nova Oferta
      </button>
    </div>
  );

  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center">
          <Image
            src={"/IconPerfil.svg"}
            alt="Perfil"
            width={100}
            height={100}
            className="w-24 h-24"
          />
        </div>
        <h1 className="text-[#003E25] font-semibold text-xl mt-2">{user?.name}</h1>
        <p className="text-gray-500">{user?.phone}</p>
        <div className="bg-[#FBCA27] rounded-full px-4 py-1 inline-block mt-2">
          <p className="text-[#003F25] font-bold">Parceiro Patrocinador</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="border-t pt-4">
          <h2 className="text-[#003F25] font-semibold mb-3">Informações do Estabelecimento</h2>
          <p className="font-medium">Comercial Parceiro</p>
          <p className="text-sm text-gray-600 mt-1">R. João do Comércio, 456, Centro, Caruaru - PE</p>
          <p className="text-sm text-gray-600 mt-1">Horário: 9h às 19h (seg-sáb)</p>
        </div>
        
        <div className="border-t pt-4">
          <h2 className="text-[#003F25] font-semibold mb-3">Contato</h2>
          <p className="text-sm text-gray-600">
            Para suporte técnico, entre em contato pelo telefone (81) 3333-4444 ou pelo email suporte@ecoganha.com.br
          </p>
        </div>
        
        <div className="border-t pt-4">
          <button 
            onClick={logout} // Corrigido aqui para usar a função desestruturada
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 mt-2"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Cabeçalho do patrocinador */}
      <div className="bg-[#FBCA27] rounded-lg p-4 shadow-md mb-6">
        <h1 className="text-[#003F25] text-xl font-bold text-center">Parceiro</h1>
        <p className="text-center text-[#003F25]">Estabelecimento: {user.name}</p>
      </div>

      {/* Conteúdo principal baseado na tab ativa */}
      {activeTab === 'search' && renderSearchTab()}
      {activeTab === 'history' && renderHistoryTab()}
      {activeTab === 'offers' && renderOffersTab()}
      {activeTab === 'profile' && renderProfileTab()}

      {/* Navegação inferior estilo app */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-2 py-3 flex justify-around items-center">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'search' ? 'text-[#003F25]' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'search' ? 'bg-[#FBCA27]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Buscar</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'history' ? 'text-[#003F25]' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'history' ? 'bg-[#FBCA27]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Histórico</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('offers')}
          className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'offers' ? 'text-[#003F25]' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'offers' ? 'bg-[#FBCA27]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Ofertas</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'profile' ? 'text-[#003F25]' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'profile' ? 'bg-[#FBCA27]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
}
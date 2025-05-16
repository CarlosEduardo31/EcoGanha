"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SponsorTabType, UserData, Offer, Redemption } from '@/types/patrocinador';

// Componentes
import SearchTab from '@/components/patrocinador/SearchTab';
import HistoryTab from '@/components/patrocinador/HistoryTab';
import OffersTab from '@/components/patrocinador/OffersTab';
import ProfileTab from '@/components/patrocinador/ProfileTab';
import BottomNavigation from '@/components/patrocinador/BottomNavigation';

export default function PatrocinadorDashboardPage() {
  const { user, isAuthenticated, logout, findUserByPhone, removePoints } = useAuth();
  const [searchPhone, setSearchPhone] = useState('');
  const [foundUser, setFoundUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const [activeTab, setActiveTab] = useState<SponsorTabType>('search');
  const router = useRouter();

  // Ofertas do patrocinador
  const [offers, setOffers] = useState<Offer[]>([
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
  ]);

  // Histórico de resgates
  const [redemptions, setRedemptions] = useState<Redemption[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Maria da Silva',
      userPhone: '81999999999',
      offerId: '1',
      offerTitle: '20% de desconto em qualquer produto',
      points: 500,
      date: new Date().toISOString()
    },
    {
      id: '2',
      userId: '4',
      userName: 'Vandilma Candido',
      userPhone: '81666666666',
      offerId: '2',
      offerTitle: 'Cupom de R$15',
      points: 300,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Ontem
    }
  ]);

  // Verificar autenticação
 useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  } else if (user && user.userType !== 'patrocinador') {
    // Redirecionar para o dashboard apropriado
    router.push(`/dashboard/${user.userType}`);
  }
}, [isAuthenticated, user, router]);

  // Buscar usuário pelo telefone - implementação simplificada
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

    // Simular uma busca com atraso (abordagem direta)
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

  // Resgatar pontos (remover pontos do usuário)
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
      // Criar novo resgate no histórico
      const newRedemption: Redemption = {
        id: Date.now().toString(),
        userId: foundUser.id,
        userName: foundUser.name,
        userPhone: foundUser.phone,
        offerId: offer.id,
        offerTitle: offer.title,
        points: offer.points,
        date: new Date().toISOString()
      };
      
      // Atualizar a lista de resgates
      setRedemptions(prev => [newRedemption, ...prev]);
      
      // Atualizar os pontos do usuário encontrado
      setFoundUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          points: prev.points - offer.points
        };
      });
      
      setSuccess(`Resgate bem-sucedido! ${offer.points} pontos foram descontados do usuário ${foundUser.name}.`);
      setLoading(false);
    }, 1000);
  };

  // Gerenciar ofertas
  const handleAddOffer = (offer: Offer) => {
    setOffers(prev => [...prev, offer]);
  };

  const handleUpdateOffer = (updatedOffer: Offer) => {
    setOffers(prev => prev.map(offer => 
      offer.id === updatedOffer.id ? updatedOffer : offer
    ));
  };

  const handleDeleteOffer = (offerId: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
  };

  // Handler para mudança de aba
  const handleTabChange = (tab: SponsorTabType) => {
    setActiveTab(tab);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25]"></div>
      </div>
    );
  }

  // Renderiza o conteúdo com base na aba ativa
  const renderContent = () => {
    // Verifique se user está disponível
    if (!user) {
      return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <p className="text-center py-4 text-gray-500">Carregando informações do usuário...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'search':
        return (
          <SearchTab
            searchPhone={searchPhone}
            setSearchPhone={setSearchPhone}
            foundUser={foundUser}
            loading={loading}
            error={error}
            success={success}
            offers={offers}
            selectedOffer={selectedOffer}
            setSelectedOffer={setSelectedOffer}
            onSearch={handleSearch}
            onRedeemPoints={handleRedeemPoints}
          />
        );
      case 'history':
        return <HistoryTab redemptions={redemptions} />;
      case 'offers':
        return (
          <OffersTab
            offers={offers}
            onAddOffer={handleAddOffer}
            onUpdateOffer={handleUpdateOffer}
            onDeleteOffer={handleDeleteOffer}
          />
        );
      case 'profile':
        return <ProfileTab user={user} onLogout={logout} />;
      default:
        return (
          <SearchTab
            searchPhone={searchPhone}
            setSearchPhone={setSearchPhone}
            foundUser={foundUser}
            loading={loading}
            error={error}
            success={success}
            offers={offers}
            selectedOffer={selectedOffer}
            setSelectedOffer={setSelectedOffer}
            onSearch={handleSearch}
            onRedeemPoints={handleRedeemPoints}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Cabeçalho do patrocinador */}
      <div className="bg-[#FBCA27] rounded-lg p-4 shadow-md mb-6">
        <h1 className="text-[#003F25] text-xl font-bold text-center">Parceiro</h1>
        <p className="text-center text-[#003F25]">Estabelecimento: {user?.name || 'Carregando...'}</p>
      </div>

      {/* Conteúdo principal baseado na aba ativa */}
      {renderContent()}

      {/* Navegação inferior */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
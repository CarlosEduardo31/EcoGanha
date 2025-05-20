// src/pages/dashboard/patrocinador.tsx

"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SponsorTabType, UserData, Offer, Redemption } from '@/types/patrocinador';
import { offerService } from '@/services/offerService';
import { redemptionService } from '@/services/redemptionService';

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
  const [offers, setOffers] = useState<Offer[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const router = useRouter();

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.userType !== 'patrocinador') {
      router.push(`/dashboard/${user?.userType}`);
    }
  }, [isAuthenticated, user, router]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Carregar ofertas do parceiro
        const offersData = await offerService.listPartnerOffers();
        setOffers(offersData);

        // Carregar histórico de resgates
        const redemptionsData = await redemptionService.listPartnerRedemptions();
        setRedemptions(redemptionsData);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      }
    };

    if (isAuthenticated && user?.userType === 'patrocinador') {
      loadInitialData();
    }
  }, [isAuthenticated, user]);

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
      const result = await findUserByPhone(searchPhone);
      
      if (result && result.userType === 'comum') {
        setFoundUser(result);
      } else {
        setError('Usuário não encontrado ou não é um usuário comum');
      }
    } catch (error) {
      setError('Erro ao buscar usuário');
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  // Selecionar um usuário recente
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
      // Chamar serviço para registrar o resgate
      await redemptionService.create({
        userId: foundUser.id,
        offerId: selectedOffer
      });
      
      // Buscar usuário atualizado para obter os pontos atualizados
      const updatedUser = await findUserByPhone(foundUser.phone);
      
      // Criar novo resgate para atualizar a UI imediatamente
      const newRedemption = {
        id: Date.now().toString(),
        userId: foundUser.id,
        userName: foundUser.name,
        userPhone: foundUser.phone,
        offerId: selectedOffer,
        offerTitle: offer.title,
        points: offer.points,
        date: new Date().toISOString()
      };
      
      setRedemptions(prev => [newRedemption, ...prev]);
      
      setSuccess(`Resgate bem-sucedido! ${offer.points} pontos foram descontados do usuário ${foundUser.name}.`);
      
      // Atualizar o usuário encontrado
      if (updatedUser) {
        setFoundUser(updatedUser);
      } else {
        // Se não conseguir buscar o usuário atualizado, atualiza manualmente
        setFoundUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            points: prev.points - offer.points
          };
        });
      }
      
      // Limpar seleção
      setSelectedOffer('');
    } catch (error) {
      setError('Erro ao processar resgate');
      console.error('Erro ao processar resgate:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gerenciar ofertas
  const handleAddOffer = async (offer: Omit<Offer, 'id'>) => {
    try {
      const newOffer = await offerService.create(offer);
      setOffers(prev => [...prev, newOffer]);
    } catch (error) {
      console.error('Erro ao adicionar oferta:', error);
      throw error;
    }
  };

  const handleUpdateOffer = async (updatedOffer: Offer) => {
    try {
      await offerService.update(updatedOffer.id, updatedOffer);
      setOffers(prev => prev.map(offer => 
        offer.id === updatedOffer.id ? updatedOffer : offer
      ));
    } catch (error) {
      console.error('Erro ao atualizar oferta:', error);
      throw error;
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await offerService.remove(offerId);
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
    } catch (error) {
      console.error('Erro ao excluir oferta:', error);
      throw error;
    }
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
        <p className="text-center text-[#003F25]">Estabelecimento: {user.name}</p>
      </div>

      {/* Conteúdo principal baseado na aba ativa */}
      {renderContent()}

      {/* Navegação inferior */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
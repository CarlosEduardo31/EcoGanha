// src/pages/dashboard/comum.tsx

"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TabType, SelectedPartner } from '@/types/interfaces';
import { offerService } from '@/services/offerService';
import { ecoPointService } from '@/services/ecoPointService';

// Componentes
import HomeTab from '@/components/usuario/HomeTab';
import RewardsTab from '@/components/usuario/RewardsTab';
import EcoPointsTab from '@/components/usuario/EcoPointsTab';
import ProfileTab from '@/components/usuario/ProfileTab';
import ActivitiesTab from '@/components/usuario/ActivitiesTab';
import RedemptionsTab from '@/components/usuario/RedemptionsTab';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function UsuarioComumPage() {
  const { user, isAuthenticated, logout, getUserRecycleHistory, getUserRedemptionHistory } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedPartner, setSelectedPartner] = useState<SelectedPartner | null>(null);
  const [recycleHistory, setRecycleHistory] = useState([]);
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [partners, setPartners] = useState([]);
  const [ecoPoints, setEcoPoints] = useState([]);

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.userType !== 'comum') {
      router.push(`/dashboard/${user?.userType}`);
    }
  }, [isAuthenticated, user, router]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Carregar histórico de reciclagem
        const recycleData = await getUserRecycleHistory();
        setRecycleHistory(recycleData);

        // Carregar histórico de resgates
        const redemptionData = await getUserRedemptionHistory();
        setRedemptionHistory(redemptionData);

        // Carregar parceiros e ofertas
        const partnersData = await offerService.listAll();
        setPartners(partnersData);

        // Carregar eco pontos
        const ecoPointsData = await ecoPointService.listAll();
        setEcoPoints(ecoPointsData);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      }
    };

    if (isAuthenticated && user?.userType === 'comum') {
      loadInitialData();
    }
  }, [isAuthenticated, user, getUserRecycleHistory, getUserRedemptionHistory]);

  // Handler para mudança de aba
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Se estiver indo para a aba de prêmios e houver um parceiro específico selecionado, limpar a seleção
    if (tab === 'rewards' && selectedPartner) {
      setSelectedPartner(null);
    }
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
      case 'home':
        return (
          <HomeTab 
            user={user} 
            recycleHistory={recycleHistory}
            partners={partners}
            onTabChange={handleTabChange} 
            setSelectedPartner={setSelectedPartner} 
          />
        );
      case 'rewards':
        return (
          <RewardsTab 
            user={user} 
            partners={partners}
            selectedPartner={selectedPartner} 
            setSelectedPartner={setSelectedPartner}
            onTabChange={handleTabChange}
          />
        );
      case 'map':
        return <EcoPointsTab ecoPoints={ecoPoints} onTabChange={handleTabChange} />;
      case 'profile':
        return (
          <ProfileTab 
            user={user} 
            onTabChange={handleTabChange} 
            onLogout={logout} 
          />
        );
      case 'activities':
        return <ActivitiesTab user={user} recycleHistory={recycleHistory} onTabChange={handleTabChange} />;
      case 'redemptions':
        return <RedemptionsTab user={user} redemptionHistory={redemptionHistory} onTabChange={handleTabChange} />;
      default:
        return (
          <HomeTab 
            user={user} 
            recycleHistory={recycleHistory}
            partners={partners}
            onTabChange={handleTabChange} 
            setSelectedPartner={setSelectedPartner} 
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Conteúdo principal baseado na tab ativa */}
      {renderContent()}

      {/* Navegação inferior estilo app */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
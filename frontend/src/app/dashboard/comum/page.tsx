// src/app/dashboard/comum/page.tsx

"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserTabType, 
  EcoPoint, 
  Partner, 
  RecycleTransaction, 
  RedemptionTransaction, 
  SelectedPartner 
} from '@/types/comum';
import { resourceService } from '@/services/resourceService';
import { userService } from '@/services/userService';

// Componentes
import HomeTab from '@/components/usuario/HomeTab';
import RewardsTab from '@/components/usuario/RewardsTab';
import EcoPointsTab from '@/components/usuario/EcoPointsTab';
import ProfileTab from '@/components/usuario/ProfileTab';
import ActivitiesTab from '@/components/usuario/ActivitiesTab';
import RedemptionsTab from '@/components/usuario/RedemptionsTab';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function UsuarioComumPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserTabType>('home');
  const [selectedPartner, setSelectedPartner] = useState<SelectedPartner | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estados dos dados
  const [recycleHistory, setRecycleHistory] = useState<RecycleTransaction[]>([]);
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionTransaction[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [ecoPoints, setEcoPoints] = useState<EcoPoint[]>([]);

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
      if (!isAuthenticated || user?.userType !== 'comum') return;
      
      setLoading(true);
      try {
        console.log('Carregando dados do usuário comum...');

        // Carregar histórico de reciclagem
        try {
          const recycleData = await userService.getRecycleHistory();
          setRecycleHistory(recycleData || []);
          console.log(`${recycleData?.length || 0} transações de reciclagem carregadas`);
        } catch (error) {
          console.error('Erro ao carregar histórico de reciclagem:', error);
          setRecycleHistory([]);
        }

        // Carregar histórico de resgates
        try {
          const redemptionData = await userService.getRedemptionHistory();
          setRedemptionHistory(redemptionData || []);
          console.log(`${redemptionData?.length || 0} resgates carregados`);
        } catch (error) {
          console.error('Erro ao carregar histórico de resgates:', error);
          setRedemptionHistory([]);
        }

        // Carregar parceiros e ofertas
        try {
          const partnersData = await resourceService.getOffers();
          setPartners(partnersData || []);
          console.log(`${partnersData?.length || 0} parceiros carregados`);
        } catch (error) {
          console.error('Erro ao carregar parceiros:', error);
          setPartners([]);
        }

        // Carregar eco pontos
        try {
          const ecoPointsData = await resourceService.getEcoPoints();
          setEcoPoints(ecoPointsData || []);
          console.log(`${ecoPointsData?.length || 0} ecopontos carregados`);
        } catch (error) {
          console.error('Erro ao carregar ecopontos:', error);
          setEcoPoints([]);
        }

      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated, user]);

  // Handler para mudança de aba
  const handleTabChange = (tab: UserTabType) => {
    setActiveTab(tab);
    // Se estiver indo para a aba de prêmios e houver um parceiro específico selecionado, limpar a seleção
    if (tab === 'rewards' && selectedPartner) {
      setSelectedPartner(null);
    }
  };

  // Estado de carregamento
  if (!user || loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25] mb-4"></div>
        <p className="text-gray-600">Carregando seus dados...</p>
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
        return (
          <ActivitiesTab 
            user={user} 
            recycleHistory={recycleHistory} 
            onTabChange={handleTabChange} 
          />
        );
      case 'redemptions':
        return (
          <RedemptionsTab 
            user={user} 
            redemptionHistory={redemptionHistory} 
            onTabChange={handleTabChange} 
          />
        );
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
      {/* Conteúdo principal baseado na aba ativa */}
      {renderContent()}

      {/* Navegação inferior */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
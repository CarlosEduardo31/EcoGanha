"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TabType, SelectedPartner } from '@/types/interfaces';

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
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedPartner, setSelectedPartner] = useState<SelectedPartner | null>(null);

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.userType !== 'comum') {
      router.push(`/dashboard/${user?.userType}`);
    }
  }, [isAuthenticated, user, router]);

  // Handler para mudança de aba
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Se estiver indo para a aba de prêmios e não tiver um parceiro específico selecionado
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
            onTabChange={handleTabChange} 
            setSelectedPartner={setSelectedPartner} 
          />
        );
      case 'rewards':
        return (
          <RewardsTab 
            user={user} 
            selectedPartner={selectedPartner} 
            setSelectedPartner={setSelectedPartner}
            onTabChange={handleTabChange}
          />
        );
      case 'map':
        return <EcoPointsTab onTabChange={handleTabChange} />;
      case 'profile':
        return (
          <ProfileTab 
            user={user} 
            onTabChange={handleTabChange} 
            onLogout={logout} 
          />
        );
      case 'activities':
        return <ActivitiesTab user={user} onTabChange={handleTabChange} />;
      case 'redemptions':
        return <RedemptionsTab user={user} onTabChange={handleTabChange} />;
      default:
        return <HomeTab 
          user={user} 
          onTabChange={handleTabChange} 
          setSelectedPartner={setSelectedPartner} 
        />;
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
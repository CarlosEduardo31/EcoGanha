"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Material, Transaction, UserData, EcoPointTabType } from '@/types/ecoponto';

// Componentes
import SearchTab from '@/components/ecoponto/SearchTab';
import HistoryTab from '@/components/ecoponto/HistoryTab';
import StatsTab from '@/components/ecoponto/StatsTab';
import ProfileTab from '@/components/ecoponto/ProfileTab';
import BottomNavigation from '@/components/ecoponto/BottomNavigation';

export default function EcoPontoDashboardPage() {
  const { user, isAuthenticated, findUserByPhone, addPoints, logout } = useAuth();
  const [searchPhone, setSearchPhone] = useState('');
  const [foundUser, setFoundUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [activeTab, setActiveTab] = useState<EcoPointTabType>('search');
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      userName: 'Maria da Silva',
      userPhone: '81999999999',
      material: 'Plástico',
      weight: '3',
      points: 150,
      date: '2025-05-07T14:30:00'
    },
    {
      id: '2',
      userName: 'Vandilma Candido',
      userPhone: '81666666666',
      material: 'Vidro',
      weight: '2.5',
      points: 100,
      date: '2025-05-06T10:15:00'
    }
  ]);
  const router = useRouter();

  // Materiais recicláveis
  const materials: Material[] = [
    { id: 'plastic', name: 'Plástico', pointsPerKg: 50 },
    { id: 'paper', name: 'Papel', pointsPerKg: 30 },
    { id: 'glass', name: 'Vidro', pointsPerKg: 40 },
    { id: 'metal', name: 'Metal', pointsPerKg: 70 },
    { id: 'electronics', name: 'Eletrônicos', pointsPerKg: 100 },
  ];

  // Estatísticas (mockadas)
  const statsData = {
    totalRecycledToday: '5.5',
    pointsDistributed: 250,
    usersServed: 2,
    mostRecycledMaterial: 'Plástico',
    materialDistribution: [
      { name: 'Plástico', percentage: 60, color: 'bg-blue-600' },
      { name: 'Vidro', percentage: 25, color: 'bg-green-600' },
      { name: 'Papel', percentage: 10, color: 'bg-yellow-600' },
      { name: 'Metal', percentage: 5, color: 'bg-red-600' }
    ]
  };

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.userType !== 'ecoponto') {
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
  const handleSearch = async (phone: string) => {
    if (!phone || phone.length < 10) {
      setError('Digite um número de telefone válido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setFoundUser(null);

    try {
      // Usar a função de busca do contexto
      const result = await findUserByPhone(phone);
      
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
  };

  // Calcular pontos com base no material e peso
  const calculatePoints = (): number => {
    if (!selectedMaterial || !weight) return 0;
    
    const material = materials.find(m => m.id === selectedMaterial);
    if (!material) return 0;
    
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum)) return 0;
    
    return Math.round(material.pointsPerKg * weightNum);
  };

  // Adicionar pontos ao usuário
  const handleAddPoints = async () => {
    if (!foundUser) {
      setError('Nenhum usuário selecionado');
      return;
    }

    if (!selectedMaterial) {
      setError('Selecione um material');
      return;
    }

    if (!weight || parseFloat(weight) <= 0) {
      setError('Digite um peso válido');
      return;
    }

    const pointsToAdd = calculatePoints();
    if (pointsToAdd <= 0) {
      setError('Erro ao calcular pontos');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Usar a função de adicionar pontos do contexto
      await addPoints(foundUser.id, pointsToAdd, selectedMaterial, parseFloat(weight));
      
      // Atualizar a lista de transações
      const newTransaction = {
        id: Date.now().toString(),
        userName: foundUser.name,
        userPhone: foundUser.phone,
        material: materials.find(m => m.id === selectedMaterial)?.name || selectedMaterial,
        weight,
        points: pointsToAdd,
        date: new Date().toISOString()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      setSuccess(`${pointsToAdd} pontos adicionados com sucesso para ${foundUser.name}!`);
      
      // Atualizar o usuário na lista de recentes
      setRecentUsers(prev => 
        prev.map(u => 
          u.id === foundUser.id 
            ? { ...u, points: u.points + pointsToAdd } 
            : u
        )
      );
      
      // Limpar formulário
      setFoundUser(null);
      setSearchPhone('');
      setSelectedMaterial('');
      setWeight('');
    } catch (error) {
      setError('Erro ao adicionar pontos');
      console.error('Erro ao adicionar pontos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler para mudança de aba
  const handleTabChange = (tab: EcoPointTabType) => {
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
            materials={materials}
            recentUsers={recentUsers}
            loading={loading}
            error={error}
            success={success}
            onSearchUser={handleSearch}
            onSelectRecentUser={handleSelectRecentUser}
            onAddPoints={handleAddPoints}
            foundUser={foundUser}
            searchPhone={searchPhone}
            setSearchPhone={setSearchPhone}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            weight={weight}
            setWeight={setWeight}
            calculatePoints={calculatePoints}
          />
        );
      case 'history':
        return <HistoryTab transactions={transactions} />;
      case 'stats':
        return <StatsTab transactions={transactions} statsData={statsData} />;
      case 'profile':
        return <ProfileTab user={user} onLogout={logout} />;
      default:
        return (
          <SearchTab 
            materials={materials}
            recentUsers={recentUsers}
            loading={loading}
            error={error}
            success={success}
            onSearchUser={handleSearch}
            onSelectRecentUser={handleSelectRecentUser}
            onAddPoints={handleAddPoints}
            foundUser={foundUser}
            searchPhone={searchPhone}
            setSearchPhone={setSearchPhone}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            weight={weight}
            setWeight={setWeight}
            calculatePoints={calculatePoints}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Cabeçalho do operador */}
      <div className="bg-[#FBCA27] rounded-lg p-4 shadow-md mb-6">
        <h1 className="text-[#003F25] text-xl font-bold text-center">Eco Ponto</h1>
        <p className="text-center text-[#003F25]">Operador: {user.name}</p>
      </div>

      {/* Conteúdo principal baseado na aba ativa */}
      {renderContent()}

      {/* Navegação inferior */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
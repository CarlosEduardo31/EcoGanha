// Atualização do componente Dashboard do EcoPonto para produção
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Material, Transaction, UserData, EcoPointTabType } from '@/types/ecoponto';
import { materialService } from '@/services/materialService';
import { transactionService } from '@/services/transactionService';
import { ecoPointService } from '@/services/ecoPointService';
import { operatorService } from '@/services/operatorService';

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [ecoPointId, setEcoPointId] = useState<string>('');
  const [ecoPointName, setEcoPointName] = useState<string>('');
  const [statsData, setStatsData] = useState({
    totalRecycledToday: '0',
    pointsDistributed: 0,
    usersServed: 0,
    mostRecycledMaterial: '',
    materialDistribution: []
  });
  const router = useRouter();

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.userType !== 'ecoponto') {
      router.push(`/dashboard/${user?.userType}`);
    }
  }, [isAuthenticated, user, router]);

  // Buscar o ecoPointId associado ao operador
  useEffect(() => {
    const fetchEcoPointId = async () => {
      try {
        const ecoPoint = await operatorService.getOperatorEcoPoint();
        setEcoPointId(ecoPoint.id);
        setEcoPointName(ecoPoint.name || 'Eco Ponto');
        console.log(`EcoPonto encontrado: ${ecoPoint.name} (ID: ${ecoPoint.id})`);
      } catch (error) {
        console.error('Erro ao buscar ID do ecoponto:', error);
        // Fallback para um ID padrão em caso de erro
        setEcoPointId('1');
        setEcoPointName('Eco Ponto');
      }
    };

    if (isAuthenticated && user?.userType === 'ecoponto') {
      fetchEcoPointId();
    }
  }, [isAuthenticated, user]);

  // Carregar dados iniciais (após ter o ecoPointId)
  useEffect(() => {
    const loadInitialData = async () => {
      if (!ecoPointId) return; // Espera até que o ecoPointId esteja disponível
      
      setLoading(true);
      try {
        console.log(`Carregando dados para o EcoPonto ID: ${ecoPointId}`);
        
        // Carregar materiais
        const materialsData = await materialService.listAll();
        setMaterials(materialsData);
        console.log(`${materialsData.length} materiais carregados`);

        // Carregar transações recentes
        const transactionsData = await transactionService.listByEcoPoint(ecoPointId);
        setTransactions(transactionsData);
        console.log(`${transactionsData.length} transações carregadas`);

        // Carregar estatísticas
        const statsData = await ecoPointService.getStats(ecoPointId);
        setStatsData(statsData);
        
        // Extrair usuários recentes das transações
        const userIds = Array.from(new Set(transactionsData.map((t: any) => t.userId)));
        const uniqueUsers: UserData[] = [];
        
        for (const userId of userIds) {
          const transaction = transactionsData.find((t: any) => t.userId === userId);
          if (transaction) {
            uniqueUsers.push({
              id: transaction.userId,
              name: transaction.userName,
              phone: transaction.userPhone,
              userType: 'comum',
              points: 0 // Valor padrão
            });
          }
        }
        
        setRecentUsers(uniqueUsers.slice(0, 5));
        console.log(`${uniqueUsers.length} usuários recentes encontrados`);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.userType === 'ecoponto' && ecoPointId) {
      loadInitialData();
    }
  }, [isAuthenticated, user, ecoPointId]);

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
      const result = await findUserByPhone(phone);
      
      if (result && result.userType === 'comum') {
        setFoundUser(result);
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
  // const calculatePoints = (): number => {
  //   if (!selectedMaterial || !weight) return 0;
    
  //   const material = materials.find(m => m.id === selectedMaterial);
  //   if (!material) return 0;
    
  //   const weightNum = parseFloat(weight);
  //   if (isNaN(weightNum)) return 0;
    
  //   return Math.round(material.pointsPerKg * weightNum);
  // };

  // Função de cálculo de pontos melhorada para o EcoPontoDashboardPage

// Calcular pontos com base no material e peso
const calculatePoints = (): number => {
  try {
    // Verificações iniciais
    if (!selectedMaterial) {
      console.log('Material não selecionado');
      return 0;
    }
    
    if (!weight || weight === '') {
      console.log('Peso não informado');
      return 0;
    }
    
    // Verificar se temos materiais carregados
    if (!materials || materials.length === 0) {
      console.log('Lista de materiais vazia');
      return 0;
    }
    
    // Log para debug
    console.log('Material selecionado ID:', selectedMaterial);
    console.log('Peso informado:', weight);
    console.log('Materiais disponíveis:', materials.map(m => `${m.id}: ${m.name} (${m.pointsPerKg})`));
    
    // Encontrar o material na lista
    const material = materials.find(m => String(m.id) === String(selectedMaterial));
    
    if (!material) {
      console.log(`Material com ID ${selectedMaterial} não encontrado na lista`);
      return 0;
    }
    
    console.log('Material encontrado:', material);
    
    // Converter peso para número
    const weightNum = parseFloat(weight.replace(',', '.'));
    
    if (isNaN(weightNum)) {
      console.log(`Peso inválido: ${weight}`);
      return 0;
    }
    
    console.log('Peso convertido:', weightNum);
    
    // Verificar se pointsPerKg existe e é um número
    if (material.pointsPerKg === undefined || material.pointsPerKg === null) {
      console.log('Material não tem pointsPerKg definido');
      return 0;
    }
    
    const pointsPerKg = parseFloat(String(material.pointsPerKg));
    
    if (isNaN(pointsPerKg)) {
      console.log(`pointsPerKg inválido: ${material.pointsPerKg}`);
      return 0;
    }
    
    console.log('Pontos por kg:', pointsPerKg);
    
    // Calcular pontos
    const calculatedPoints = Math.round(pointsPerKg * weightNum);
    console.log('Pontos calculados:', calculatedPoints);
    
    return calculatedPoints;
  } catch (error) {
    console.error('Erro ao calcular pontos:', error);
    return 0;
  }
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

    if (!ecoPointId) {
      setError('ID do EcoPonto não disponível. Tente novamente em instantes.');
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
      // Usando o ecoPointId obtido dinamicamente
      await addPoints(foundUser.id, selectedMaterial, parseFloat(weight), ecoPointId);
      
      // Criar nova transação para atualizar a UI imediatamente
      const material = materials.find(m => m.id === selectedMaterial);
      const newTransaction = {
        id: Date.now().toString(),
        userName: foundUser.name,
        userPhone: foundUser.phone,
        material: material?.name || 'Desconhecido',
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
      
      // Recarregar estatísticas
      const updatedStats = await ecoPointService.getStats(ecoPointId);
      setStatsData(updatedStats);
    } catch (error: any) {
      // Tratamento mais detalhado do erro
      if (error.response?.data?.message) {
        setError(`Erro: ${error.response.data.message}`);
      } else {
        setError('Erro ao adicionar pontos. Verifique sua conexão e tente novamente.');
      }
      console.error('Erro ao adicionar pontos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler para mudança de aba
  const handleTabChange = (tab: EcoPointTabType) => {
    setActiveTab(tab);
  };

  // Estado de carregamento
  if (!user || !ecoPointId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25] mb-4"></div>
        <p className="text-gray-600">Carregando informações do Eco Ponto...</p>
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
        <h1 className="text-[#003F25] text-xl font-bold text-center">{ecoPointName}</h1>
        <p className="text-center text-[#003F25]">Operador: {user.name}</p>
      </div>

      {/* Conteúdo principal baseado na aba ativa */}
      {renderContent()}

      {/* Navegação inferior */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
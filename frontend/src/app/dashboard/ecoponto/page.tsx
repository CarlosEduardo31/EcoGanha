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

interface Material {
  id: string;
  name: string;
  pointsPerKg: number;
}

interface Transaction {
  id: string;
  userName: string;
  userPhone: string;
  material: string;
  weight: string;
  points: number;
  date: string;
}

export default function EcoPontoDashboardPage() {
  const { user, isAuthenticated, findUserByPhone, addPoints, logout } = useAuth();
  const [searchPhone, setSearchPhone] = useState('');
  const [foundUser, setFoundUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [activeTab, setActiveTab] = useState('search');
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
  const handleSearch = async () => {
    if (!searchPhone || searchPhone.length < 10) {
      setError('Digite um número de telefone válido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setFoundUser(null);

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
      // Adicionar pontos (substituir pela função real)
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
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-4">Buscar Usuário</h2>
        
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

        {/* Usuários recentes */}
        {recentUsers.length > 0 && !foundUser && (
          <div className="mt-4">
            <h3 className="text-gray-600 font-medium text-sm mb-2">Usuários recentes:</h3>
            <div className="space-y-2">
              {recentUsers.map(recentUser => (
                <div 
                  key={recentUser.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectRecentUser(recentUser)}
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
              onClick={handleAddPoints}
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

  const renderHistoryTab = () => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Histórico de Transações</h2>
      
      {transactions.length === 0 ? (
        <p className="text-center py-4 text-gray-500">
          Nenhuma transação registrada ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="border-b pb-3 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{transaction.userName}</p>
                    <p className="text-sm text-gray-500">{transaction.userPhone}</p>
                  </div>
                </div>
                <span className="text-green-600 font-medium">+{transaction.points} pontos</span>
              </div>
              <div className="ml-12 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Material:</span> {transaction.material}
                </div>
                <div>
                  <span className="text-gray-500">Peso:</span> {transaction.weight}kg
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Data:</span> {formatDate(transaction.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStatsTab = () => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Estatísticas de Reciclagem</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Reciclado Hoje</p>
          <p className="text-2xl font-bold text-[#003F25]">5.5 kg</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Pontos Distribuídos</p>
          <p className="text-2xl font-bold text-[#003F25]">250</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Usuários Atendidos</p>
          <p className="text-2xl font-bold text-[#003F25]">2</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Material Mais Reciclado</p>
          <p className="text-2xl font-bold text-[#003F25]">Plástico</p>
        </div>
      </div>
      
      <h3 className="text-[#003F25] font-semibold mb-3">Distribuição por Material</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        {/* Gráfico simplificado */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Plástico</span>
              <span className="text-sm font-medium">60%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "60%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Vidro</span>
              <span className="text-sm font-medium">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Papel</span>
              <span className="text-sm font-medium">10%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: "10%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Metal</span>
              <span className="text-sm font-medium">5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "5%" }}></div>
            </div>
          </div>
        </div>
      </div>
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
          <p className="text-[#003F25] font-bold">Operador Eco Ponto</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="border-t pt-4">
          <h2 className="text-[#003F25] font-semibold mb-3">Seu Eco Ponto</h2>
          <p className="font-medium">Eco Ponto Centro</p>
          <p className="text-sm text-gray-600 mt-1">Av. Agamenon Magalhães, 123, Centro, Caruaru - PE</p>
          <p className="text-sm text-gray-600 mt-1">Horário: 8h às 18h (seg-sex), 9h às 14h (sáb)</p>
        </div>
        
        <div className="border-t pt-4">
          <h2 className="text-[#003F25] font-semibold mb-3">Contato</h2>
          <p className="text-sm text-gray-600">
            Para suporte técnico, entre em contato pelo telefone (81) 3333-4444 ou pelo email suporte@ecoganha.com.br
          </p>
        </div>
        
        <div className="border-t pt-4">
          <button 
            onClick={logout}
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
      {/* Cabeçalho do operador */}
      <div className="bg-[#FBCA27] rounded-lg p-4 shadow-md mb-6">
        <h1 className="text-[#003F25] text-xl font-bold text-center">Eco Ponto</h1>
        <p className="text-center text-[#003F25]">Operador: {user.name}</p>
      </div>

      {/* Conteúdo principal baseado na tab ativa */}
      {activeTab === 'search' && renderSearchTab()}
      {activeTab === 'history' && renderHistoryTab()}
      {activeTab === 'stats' && renderStatsTab()}
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
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'stats' ? 'text-[#003F25]' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'stats' ? 'bg-[#FBCA27]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Estatísticas</span>
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
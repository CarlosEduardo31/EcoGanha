// Atualização para o AuthContext para incluir funcionalidade de cadastro
// contexts/AuthContext.tsx

"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUsers, mockRecycleHistory, mockRedemptionHistory } from '@/data/mockData';
import { registerUser } from '@/services/authService';

// Tipos de usuário
export type UserType = 'comum' | 'ecoponto' | 'patrocinador';

export interface User {
  id: string;
  name: string;
  phone: string;
  userType: UserType;
  points: number;
}

// Interface para dados de cadastro
export interface RegisterData {
  nome: string;
  telefone: string;
  senha: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  referencia: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>; // Nova função de registro
  logout: () => void;
  isAuthenticated: boolean;
  findUserByPhone: (phone: string) => Promise<User | null>;
  addPoints: (userId: string, points: number, materialType: string, weight: number) => Promise<void>;
  removePoints: (userId: string, points: number, partnerId: string, offerTitle: string) => Promise<void>;
  getUserRecycleHistory: (userId: string) => any[];
  getUserRedemptionHistory: (userId: string) => any[];
}

// Contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente provedor que envolverá sua aplicação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [recycleHistory, setRecycleHistory] = useState(mockRecycleHistory);
  const [redemptionHistory, setRedemptionHistory] = useState(mockRedemptionHistory);

  // Verificar se existe um usuário salvo no localStorage ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('ecoGanhaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função de login
  async function login(phone: string, password: string) {
    console.log('Função login chamada com telefone:', phone);
    try {
      // No mundo real, aqui ocorreria uma chamada à API
      // Simulação de verificação
      const foundUser = users.find(u => u.phone === phone);
      console.log('Usuário encontrado:', foundUser);
      
      // Para simplificar, qualquer senha é válida neste mock
      if (foundUser) {
        console.log('Usuário válido, atualizando estado');
        setUser(foundUser);
        // Salvar no localStorage para persistir o login
        localStorage.setItem('ecoGanhaUser', JSON.stringify(foundUser));
        console.log('Usuário salvo no localStorage');
      } else {
        console.log('Usuário não encontrado');
        throw new Error('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Nova função de registro
  async function register(data: RegisterData) {
    try {
      // Verificar se o telefone já está em uso
      const existingUser = users.find(u => u.phone === data.telefone);
      if (existingUser) {
        throw new Error('Este número de telefone já está cadastrado');
      }

      // Formatar os dados para o formato esperado pela API
      const formattedData = {
        ...data,
        // Outras transformações de dados, se necessário
      };

      // Chamar serviço de registro
      const newUser = await registerUser(formattedData);

      // Criar objeto de usuário no formato esperado pelo contexto
      const userToAdd: User = {
        id: newUser.id,
        name: newUser.nome,
        phone: newUser.telefone,
        userType: 'comum' as UserType,
        points: 0
      };

      // Adicionar à lista de usuários
      setUsers(prevUsers => [...prevUsers, userToAdd]);
      
      console.log('Usuário cadastrado com sucesso:', userToAdd);
      
      // Opcionalmente, fazer login automático
      // setUser(userToAdd);
      // localStorage.setItem('ecoGanhaUser', JSON.stringify(userToAdd));
      
      return;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  }

  // Função de logout
  function logout() {
    setUser(null);
    localStorage.removeItem('ecoGanhaUser');
  }

  // Função para buscar usuário pelo telefone (usada pelos operadores de Eco Ponto e Patrocinadores)
  async function findUserByPhone(phone: string): Promise<User | null> {
    // Simulando uma busca na API
    return users.find(u => u.phone === phone) || null;
  }

  // Função para adicionar pontos (usada pelos operadores de Eco Ponto)
  async function addPoints(userId: string, points: number, materialType: string, weight: number) {
    // Simulando uma atualização na API
    const updatedUsers = users.map(u => {
      if (u.id === userId && u.userType === 'comum') {
        return { ...u, points: u.points + points };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    
    // Adicionar ao histórico de reciclagem
    const newRecycleEntry = {
      id: Date.now().toString(),
      userId,
      materialType,
      materialName: getMaterialName(materialType),
      weight,
      points,
      date: new Date().toISOString(),
      ecoPointId: '1' // ID fixo para simplificar
    };
    
    setRecycleHistory([newRecycleEntry, ...recycleHistory]);
    
    // Se o usuário logado for o que recebeu pontos, atualizamos o estado
    if (user && user.id === userId) {
      const updatedUser = { ...user, points: user.points + points };
      setUser(updatedUser);
      localStorage.setItem('ecoGanhaUser', JSON.stringify(updatedUser));
    }
  }

  // Função auxiliar para obter o nome do material
  function getMaterialName(materialType: string): string {
    const materials = {
      plastic: 'Plástico',
      glass: 'Vidro',
      paper: 'Papel',
      metal: 'Metal',
      electronics: 'Eletrônicos'
    };
    return materials[materialType as keyof typeof materials] || materialType;
  }

  // Função para remover pontos (usada pelos Patrocinadores)
  async function removePoints(userId: string, points: number, partnerId: string, offerTitle: string) {
    // Simulando uma atualização na API
    const userToUpdate = users.find(u => u.id === userId);
    
    if (!userToUpdate || userToUpdate.userType !== 'comum') {
      throw new Error('Usuário não encontrado ou não é um usuário comum');
    }
    
    if (userToUpdate.points < points) {
      throw new Error('Pontos insuficientes');
    }
    
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, points: u.points - points };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    
    // Adicionar ao histórico de resgates
    const newRedemptionEntry = {
      id: Date.now().toString(),
      userId,
      partnerName: getPartnerName(partnerId),
      prize: offerTitle,
      points,
      date: new Date().toISOString()
    };
    
    setRedemptionHistory([newRedemptionEntry, ...redemptionHistory]);
    
    // Se o usuário logado for o que perdeu pontos, atualizamos o estado
    if (user && user.id === userId) {
      const updatedUser = { ...user, points: user.points - points };
      setUser(updatedUser);
      localStorage.setItem('ecoGanhaUser', JSON.stringify(updatedUser));
    }
  }

  // Função auxiliar para obter o nome do parceiro
  function getPartnerName(partnerId: string): string {
    const partnerNames = {
      '1': 'O Boticário',
      '2': 'iFood',
      '3': 'Assaí',
      '4': 'Claro'
    };
    return partnerNames[partnerId as keyof typeof partnerNames] || 'Parceiro';
  }

  // Função para obter o histórico de reciclagem de um usuário
  function getUserRecycleHistory(userId: string) {
    return recycleHistory.filter(item => item.userId === userId);
  }

  // Função para obter o histórico de resgates de um usuário
  function getUserRedemptionHistory(userId: string) {
    return redemptionHistory.filter(item => item.userId === userId);
  }

  // Retornamos o Provider com todos os valores e funções
  return (
    <AuthContext.Provider value={{ 
      user, 
      login,
      register, // Nova função adicionada
      logout, 
      isAuthenticated: !!user,
      findUserByPhone,
      addPoints,
      removePoints,
      getUserRecycleHistory,
      getUserRedemptionHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
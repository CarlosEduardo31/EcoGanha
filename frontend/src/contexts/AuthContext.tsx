"use client";

// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import { userService } from '@/services/userService';
import { transactionService } from '@/services/transactionService';
import { redemptionService } from '@/services/redemptionService';

// Tipos
export type UserType = 'comum' | 'ecoponto' | 'patrocinador' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  userType: UserType;
  points: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  findUserByPhone: (phone: string) => Promise<User | null>;
  addPoints: (userId: string, materialId: string, weight: number, ecoPointId: string) => Promise<void>;
  removePoints: (userId: string, offerId: string) => Promise<void>;
  getUserRecycleHistory: () => Promise<any[]>;
  getUserRedemptionHistory: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar se existe um usuário autenticado ao carregar a página
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // Verificar se existe token no localStorage
        if (authService.isAuthenticated()) {
          // Se existe token, buscar dados do perfil
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Se não conseguiu buscar o usuário, limpar token
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Função de login
  const login = async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      // Usar o serviço de autenticação para login
      const loggedUser = await authService.login({ phone, password });
      
      // Salvar dados do usuário no estado
      setUser(loggedUser);
      
      // Redirecionar para a dashboard adequada baseada no tipo de usuário
      if (loggedUser.userType === 'comum') {
        router.push('/dashboard/comum');
      } else if (loggedUser.userType === 'ecoponto') {
        router.push('/dashboard/ecoponto');
      } else if (loggedUser.userType === 'patrocinador') {
        router.push('/dashboard/patrocinador');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  // Função para buscar usuário pelo telefone (para operadores e patrocinadores)
  const findUserByPhone = async (phone: string): Promise<User | null> => {
    try {
      return await userService.findByPhone(phone);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  };

  // Função para adicionar pontos (apenas para operadores de EcoPonto)
  const addPoints = async (userId: string, materialId: string, weight: number, ecoPointId: string) => {
    try {
      await transactionService.create({
        userId,
        materialId,
        weight,
        ecoPointId
      });
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      throw error;
    }
  };

  // Função para resgatar pontos (apenas para patrocinadores)
  const removePoints = async (userId: string, offerId: string) => {
    try {
      await redemptionService.create({
        userId,
        offerId
      });
    } catch (error) {
      console.error('Erro ao resgatar pontos:', error);
      throw error;
    }
  };

  // Função para obter histórico de reciclagem do usuário
  const getUserRecycleHistory = async () => {
    try {
      const response = await userService.getRecycleHistory();
      return response || [];
    } catch (error) {
      console.error('Erro ao buscar histórico de reciclagem:', error);
      return [];
    }
  };

  // Função para obter histórico de resgates do usuário
  const getUserRedemptionHistory = async () => {
    try {
      const response = await userService.getRedemptionHistory();
      return response || [];
    } catch (error) {
      console.error('Erro ao buscar histórico de resgates:', error);
      return [];
    }
  };

  // Retornamos o Provider com todos os valores e funções
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isLoading,
      login, 
      logout, 
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
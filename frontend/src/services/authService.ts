// src/services/authService.ts

import api from './api';

/**
 * Interface para os dados de login
 */
interface LoginCredentials {
  phone: string;
  password: string;
}

/**
 * Interface para os dados de registro
 */
interface RegisterData {
  name: string;
  phone: string;
  password: string;
  userType: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    reference?: string;
  };
}

/**
 * Interface para a resposta de usuário
 */
interface UserResponse {
  id: string;
  name: string;
  phone: string;
  userType: string;
  points: number;
  token?: string;
}

/**
 * Serviço responsável por operações relacionadas à autenticação
 */
const authService = {
  /**
   * Realiza o login do usuário
   * @param credentials - Credenciais de login (telefone e senha)
   * @returns Dados do usuário com token
   */
  login: async (credentials: LoginCredentials): Promise<UserResponse> => {
    try {
      // Limpa formatação do telefone (remove parênteses, espaços e traços)
      const cleanPhone = credentials.phone.replace(/\D/g, '');
      
      const response = await api.post('/auth/login', {
        ...credentials,
        phone: cleanPhone
      });
      
      // Salvar token no localStorage
      if (response.data.data.token) {
        localStorage.setItem('ecoGanhaToken', response.data.data.token);
      }
      
      return response.data.data.user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  /**
   * Registra um novo usuário
   * @param userData - Dados do novo usuário
   * @returns Dados do usuário criado com token
   */
  register: async (userData: RegisterData): Promise<UserResponse> => {
    try {
      // Limpa formatação do telefone (remove parênteses, espaços e traços)
      const cleanPhone = userData.phone.replace(/\D/g, '');
      
      const response = await api.post('/auth/register', {
        ...userData,
        phone: cleanPhone
      });
      
      // Salvar token no localStorage
      if (response.data.data.token) {
        localStorage.setItem('ecoGanhaToken', response.data.data.token);
      }
      
      return response.data.data.user;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  /**
   * Realiza o logout do usuário
   */
  logout: (): void => {
    // Remove o token
    localStorage.removeItem('ecoGanhaToken');
    
    // Limpa qualquer cache que o navegador possa ter para rotas protegidas
    if (typeof window !== 'undefined') {
      // Força a página a recarregar para limpar estados do React
      window.location.href = '/login';
    }
  },

  /**
   * Verifica se existe um token salvo
   * @returns Verdadeiro se existir um token
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('ecoGanhaToken');
    return !!token;
  },

  /**
   * Obtém o token de autenticação
   * @returns Token JWT ou null
   */
  getToken: (): string | null => {
    return localStorage.getItem('ecoGanhaToken');
  },

  /**
   * Verifica se o perfil do usuário logado
   * @returns Dados do usuário
   */
  getCurrentUser: async (): Promise<UserResponse | null> => {
    try {
      const response = await api.get('/users/profile');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  },

  /**
   * Testa a conexão com a API
   * @returns true se conexão ok, false caso contrário
   */
  testConnection: async (): Promise<boolean> => {
    try {
      // Tenta acessar a lista de materiais (endpoint público)
      await api.get('/materials');
      return true;
    } catch (error) {
      console.error('Erro ao testar conexão com API:', error);
      return false;
    }
  }
};

export default authService;
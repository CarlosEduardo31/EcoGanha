// src/services/userService.ts

import api from './api';

// Interface para cadastro de usuário
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

// Interface para atualização de perfil
interface UpdateProfileData {
  name?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    reference?: string;
  };
}

export const userService = {
  // Registrar novo usuário
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Obter perfil do usuário logado
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data.data;
  },
  
  // Atualizar perfil do usuário
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.patch('/users/profile', data);
    return response.data.data;
  },
  
  // Buscar usuário por telefone (para operadores de EcoPonto e Patrocinadores)
  findByPhone: async (phone: string) => {
    const response = await api.get(`/users/by-phone/${phone}`);
    return response.data.data;
  },
  
  // Obter histórico de reciclagem
  getRecycleHistory: async () => {
    const response = await api.get('/users/recycle-history');
    return response.data.data;
  },
  
  // Obter histórico de resgates
  getRedemptionHistory: async () => {
    const response = await api.get('/users/redemption-history');
    return response.data.data;
  },
  
  // Listar todos os usuários (admin)
  listAll: async () => {
    const response = await api.get('/users');
    return response.data.data;
  },
  
  // Obter usuário por ID (admin)
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  }
};
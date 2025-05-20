// src/services/transactionService.ts

import api from './api';

interface TransactionData {
  userId: string;
  materialId: string;
  weight: number;
  ecoPointId: string;
  notes?: string;
}

export const transactionService = {
  // Registrar nova transação de reciclagem (operadores de EcoPonto)
  create: async (data: TransactionData) => {
    const response = await api.post('/transactions', data);
    return response.data.data;
  },

  // Obter transações de um EcoPonto específico
  getByEcoPoint: async (ecoPointId: string) => {
    const response = await api.get(`/transactions/eco-point/${ecoPointId}`);
    return response.data.data;
  },
  
  // Alias para getByEcoPoint para compatibilidade com o componente
  listByEcoPoint: async (ecoPointId: string) => {
    const response = await api.get(`/transactions/eco-point/${ecoPointId}`);
    return response.data.data;
  },

  // Obter estatísticas de um EcoPonto
  getEcoPointStats: async (ecoPointId: string) => {
    const response = await api.get(`/transactions/eco-point/${ecoPointId}/stats`);
    return response.data.data;
  }
};

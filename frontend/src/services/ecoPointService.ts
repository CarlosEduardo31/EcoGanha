// src/services/ecoPointService.ts

import api from './api';

export const ecoPointService = {
  // Listar todos os pontos de coleta
  listAll: async () => {
    const response = await api.get('/eco-points');
    return response.data.data;
  },

  // Obter um ponto de coleta específico
  getById: async (id: string) => {
    const response = await api.get(`/eco-points/${id}`);
    return response.data.data;
  },

  // Obter estatísticas de um ponto de coleta
  getStats: async (id: string) => {
    const response = await api.get(`/transactions/eco-point/${id}/stats`);
    return response.data.data;
  },

  // Criar novo ponto de coleta (admin)
  create: async (ecoPointData: any) => {
    const response = await api.post('/eco-points', ecoPointData);
    return response.data.data;
  },

  // Atualizar ponto de coleta (admin)
  update: async (id: string, ecoPointData: any) => {
    const response = await api.patch(`/eco-points/${id}`, ecoPointData);
    return response.data.data;
  },

  // Excluir ponto de coleta (admin)
  delete: async (id: string) => {
    await api.delete(`/eco-points/${id}`);
    return true;
  }
};
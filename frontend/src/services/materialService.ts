// src/services/materialService.ts

import api from './api';

export const materialService = {
  // Listar todos os materiais
  listAll: async () => {
    const response = await api.get('/materials');
    return response.data.data;
  },

  // Obter um material específico
  getById: async (id: string) => {
    const response = await api.get(`/materials/${id}`);
    return response.data.data;
  },

  // Criar novo material (admin)
  create: async (materialData: any) => {
    const response = await api.post('/materials', materialData);
    return response.data.data;
  },

  // Atualizar material (admin)
  update: async (id: string, materialData: any) => {
    const response = await api.patch(`/materials/${id}`, materialData);
    return response.data.data;
  },

  // Excluir material (admin)
  delete: async (id: string) => {
    await api.delete(`/materials/${id}`);
    return true;
  }
};
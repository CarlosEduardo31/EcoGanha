// src/services/offerService.ts

import api from './api';

// Interface para uma oferta
interface Offer {
  id: string;
  title: string;
  description: string;
  points: number;
  validUntil?: string;
}

export const offerService = {
  // Listar todas as ofertas disponíveis
  listAll: async () => {
    try {
      const response = await api.get('/offers');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao listar ofertas:', error);
      throw error;
    }
  },
  
  // Listar ofertas do parceiro logado
  listPartnerOffers: async () => {
    try {
      const response = await api.get('/offers/partner');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao listar ofertas do parceiro:', error);
      throw error;
    }
  },
  
  // Criar nova oferta
  create: async (data: Omit<Offer, 'id'>) => {
    try {
      const response = await api.post('/offers', data);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar oferta:', error);
      throw error;
    }
  },
  
  // Atualizar oferta
  update: async (id: string, data: Partial<Offer>) => {
    try {
      const response = await api.patch(`/offers/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar oferta:', error);
      throw error;
    }
  },
  
  // Remover oferta
  remove: async (id: string) => {
    try {
      await api.delete(`/offers/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover oferta:', error);
      throw error;
    }
  }
};
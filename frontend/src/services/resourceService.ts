// src/services/resourceService.ts

import api from './api';

// Serviço para recursos comuns da aplicação
export const resourceService = {
  // EcoPoints
  getEcoPoints: async () => {
    const response = await api.get('/eco-points');
    return response.data.data;
  },

  getEcoPoint: async (id: string) => {
    const response = await api.get(`/eco-points/${id}`);
    return response.data.data;
  },

  // Materials
  getMaterials: async () => {
    const response = await api.get('/materials');
    return response.data.data;
  },

  getMaterial: async (id: string) => {
    const response = await api.get(`/materials/${id}`);
    return response.data.data;
  },

  // Offers
  getOffers: async () => {
    const response = await api.get('/offers');
    return response.data.data;
  },

  // Partner Offers (para patrocinadores)
  getPartnerOffers: async () => {
    const response = await api.get('/offers/partner');
    return response.data.data;
  },

  createOffer: async (offerData: any) => {
    const response = await api.post('/offers', offerData);
    return response.data.data;
  },

  updateOffer: async (id: string, offerData: any) => {
    const response = await api.patch(`/offers/${id}`, offerData);
    return response.data.data;
  },

  deleteOffer: async (id: string) => {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
  }
};
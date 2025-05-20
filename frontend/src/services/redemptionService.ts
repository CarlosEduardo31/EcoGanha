
// src/services/redemptionService.ts

import api from './api';

interface RedemptionData {
  userId: string;
  offerId: string;
}

export const redemptionService = {
  // Registrar novo resgate de oferta (patrocinadores)
  create: async (data: RedemptionData) => {
    const response = await api.post('/redemptions', data);
    return response.data.data;
  },

  // Obter resgates de um parceiro
  getPartnerRedemptions: async () => {
    const response = await api.get('/redemptions/partner');
    return response.data.data;
  }
};
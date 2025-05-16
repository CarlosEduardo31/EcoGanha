// Tipos para o dashboard do Patrocinador
export type SponsorTabType = 'search' | 'history' | 'offers' | 'profile';

// Interface para os dados do usuário
export interface UserData {
  id: string;
  name: string;
  phone: string;
  userType: string;
  points: number;
}

// Interface para as ofertas do patrocinador
export interface Offer {
  id: string;
  title: string;
  description: string;
  points: number;
}

// Interface para os resgates realizados
export interface Redemption {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  offerId: string;
  offerTitle: string;
  points: number;
  date: string;
}
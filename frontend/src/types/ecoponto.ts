// Tipos para o dashboard do Eco Ponto
export type EcoPointTabType = 'search' | 'history' | 'stats' | 'profile';

// Interface para os dados do usuário
export interface UserData {
  id: string;
  name: string;
  phone: string;
  userType: string;
  points: number;
}

// Interface para os materiais recicláveis
export interface Material {
  id: string;
  name: string;
  pointsPerKg: number;
}

// Interface para as transações de reciclagem
export interface Transaction {
  id: string;
  userName: string;
  userPhone: string;
  material: string;
  weight: string;
  points: number;
  date: string;
}
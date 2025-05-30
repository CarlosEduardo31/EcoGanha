// src/types/ecoponto.ts

// Tipos de dados para o dashboard do EcoPonto

export interface Material {
  id: string;
  name: string;
  pointsPerKg: number;
}

export interface Transaction {
  id: string;
  userName: string;
  userPhone: string;
  material: string;
  weight: string;
  points: number;
  date: string;
}

export interface UserData {
  id: string;
  name: string;
  phone: string;
  userType: string;
  points: number;
}

export type EcoPointTabType = 'search' | 'history' | 'stats' | 'profile';
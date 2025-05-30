// src/data/mockData.ts
import { User, UserType } from '@/contexts/AuthContext';

// Dados mockados de usuários
export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Maria da Silva', 
    phone: '81999999999', 
    userType: 'comum' as UserType, 
    points: 150 
  },
  { 
    id: '2', 
    name: 'João Operador', 
    phone: '81888888888', 
    userType: 'ecoponto' as UserType, 
    points: 0 
  },
  { 
    id: '3', 
    name: 'Comercial Parceiro', 
    phone: '81777777777', 
    userType: 'patrocinador' as UserType, 
    points: 0 
  },
  { 
    id: '4', 
    name: 'Vandilma Candido', 
    phone: '81666666666', 
    userType: 'comum' as UserType, 
    points: 2000 
  },
];

// Dados mockados de reciclagem
export const mockRecycleHistory = [
  {
    id: '1',
    userId: '1',
    materialType: 'plastic',
    materialName: 'Plástico',
    weight: 3,
    points: 150,
    date: '2025-05-07T14:30:00',
    ecoPointId: '1'
  },
  {
    id: '2',
    userId: '4',
    materialType: 'glass',
    materialName: 'Vidro',
    weight: 5,
    points: 200,
    date: '2025-05-06T10:15:00',
    ecoPointId: '2'
  },
  {
    id: '3',
    userId: '1',
    materialType: 'paper',
    materialName: 'Papel',
    weight: 2,
    points: 60,
    date: '2025-05-05T16:45:00',
    ecoPointId: '1'
  }
];

// Dados mockados de prêmios resgatados
export const mockRedemptionHistory = [
  {
    id: '1',
    userId: '4',
    partnerName: 'O Boticário',
    prize: 'Desconto de 20% em qualquer produto',
    points: 500,
    date: '2025-05-01T11:20:00'
  },
  {
    id: '2',
    userId: '1',
    partnerName: 'Ifood',
    prize: 'Cupom de R$15 para pedidos acima de R$30',
    points: 300,
    date: '2025-04-28T18:10:00'
  }
];

// Dados mockados de pontos de coleta
export const mockEcoPoints = [
  {
    id: '1',
    name: 'Eco Ponto Centro',
    address: 'Av. Agamenon Magalhães, 123, Centro, Caruaru - PE',
    openingHours: '8h às 18h (seg-sex), 9h às 14h (sáb)',
    materials: ['plastic', 'paper', 'glass', 'metal']
  },
  {
    id: '2',
    name: 'Eco Ponto Norte',
    address: 'Rua São João, 456, Bairro Novo, Caruaru - PE',
    openingHours: '8h às 17h (seg-sex)',
    materials: ['plastic', 'paper', 'glass', 'metal', 'electronics']
  }
];

// Dados mockados de parceiros
export const mockPartners = [
  {
    id: '1',
    name: 'O Boticário',
    logo: '/IconBoticario.svg',
    offers: [
      {
        id: '101',
        title: '20% de desconto em qualquer produto',
        description: 'Válido para compras acima de R$100',
        points: 500,
        validUntil: '2025-06-30'
      },
      {
        id: '102',
        title: 'Cupom de R$50',
        description: 'Válido para compras acima de R$150',
        points: 800,
        validUntil: '2025-06-30'
      }
    ]
  },
  {
    id: '2',
    name: 'iFood',
    logo: '/IconIfood.svg',
    offers: [
      {
        id: '201',
        title: 'R$15 de desconto',
        description: 'Válido para pedidos acima de R$30',
        points: 300,
        validUntil: '2025-06-30'
      }
    ]
  },
  {
    id: '3',
    name: 'Assaí',
    logo: '/IconAssai.svg',
    offers: [
      {
        id: '301',
        title: '10% de desconto em frutas e verduras',
        description: 'Válido uma vez por semana',
        points: 400,
        validUntil: '2025-06-30'
      }
    ]
  },
  {
    id: '4',
    name: 'Claro',
    logo: '/IconClaro.svg',
    offers: [
      {
        id: '401',
        title: '1GB de internet extra',
        description: 'Válido por 30 dias',
        points: 350,
        validUntil: '2025-06-30'
      }
    ]
  }
];
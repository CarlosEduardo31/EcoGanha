// Interfaces para as abas da aplicação
export type TabType = 'home' | 'rewards' | 'map' | 'profile' | 'activities' | 'redemptions';

// Interface para materiais recicláveis
export interface Material {
  id: string;
  name: string;
  points: number;
}

// Interface para mapear tipo de material para nome legível
export interface MaterialMapping {
  [key: string]: string;
}

// Interface estendida para parceiro selecionado
export interface SelectedPartner {
  id: string;
  name: string;
  logo: string;
  offers: {
    id: string;
    title: string;
    description: string;
    points: number;
    validUntil: string;
  }[];
  location?: string;
}
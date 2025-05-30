import { MaterialMapping } from '@/types/interfaces';

// Mapeamento de tipos de materiais para nomes em português
export const materialMap: MaterialMapping = {
  'plastic': 'Plástico',
  'paper': 'Papel',
  'glass': 'Vidro',
  'metal': 'Metal',
  'electronics': 'Eletrônicos',
  'oil': 'Óleo de cozinha'
};

// Função para obter nome do material a partir do tipo
export const getMaterialName = (materialType: string): string => {
  return materialMap[materialType] || materialType;
};

// Função para formatar data
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
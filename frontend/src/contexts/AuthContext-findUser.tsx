// Implementação alternativa da função findUserByPhone que pode ser usada
// se a função do contexto de autenticação não estiver funcionando corretamente

import { User } from '@/contexts/AuthContext';

/**
 * Procura um usuário pelo número de telefone
 * @param phone - Número de telefone do usuário
 * @returns Usuário encontrado ou null
 */
export const findUserByPhone = async (phone: string): Promise<User | null> => {
  console.log("Função alternativa findUserByPhone chamada com:", phone);
  
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Usuários mockados para busca
  const mockUsers = [
    { 
      id: '1', 
      name: 'Maria da Silva', 
      phone: '81999999999', 
      userType: 'comum', 
      points: 150 
    },
    { 
      id: '4', 
      name: 'Vandilma Candido', 
      phone: '81666666666', 
      userType: 'comum', 
      points: 2000 
    },
  ];
  
  // Buscar usuário pelo telefone
  const user = mockUsers.find(u => u.phone === phone);
  console.log("Resultado da busca alternativa:", user || "Usuário não encontrado");
  
  if (!user) {
    return null;
  }
  
  return user as User;
};
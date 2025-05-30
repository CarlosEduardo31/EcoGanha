// Implementação do método removePoints usado pelo Patrocinador
// Este arquivo contém apenas a implementação do método, para ser integrado ao AuthContext

/**
 * Remove pontos de um usuário comum (usado pelo Patrocinador)
 * @param userId - ID do usuário
 * @param points - Quantidade de pontos a remover
 * @param partnerId - ID do parceiro (opcional)
 * @param offerTitle - Título da oferta resgatada (opcional)
 * @returns Promise que resolve quando os pontos são removidos com sucesso
 */
export const removePoints = async (
  userId: string, 
  points: number, 
  partnerId?: string, 
  offerTitle?: string
): Promise<void> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Em uma implementação real, isso seria uma chamada à API
  console.log(`Removendo ${points} pontos do usuário ${userId}`);
  if (partnerId) {
    console.log(`Parceiro: ${partnerId}`);
  }
  if (offerTitle) {
    console.log(`Oferta: ${offerTitle}`);
  }
  
  // Buscar usuário (simulado)
  const mockUsers = [
    { id: '1', name: 'Maria da Silva', phone: '81999999999', userType: 'comum', points: 500 },
    { id: '4', name: 'Vandilma Candido', phone: '81666666666', userType: 'comum', points: 2000 },
  ];
  
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Usuário não encontrado');
  }
  
  if (mockUsers[userIndex].points < points) {
    throw new Error('Pontos insuficientes');
  }
  
  // Atualizar pontos (simulado)
  mockUsers[userIndex].points -= points;
  
  // Em uma implementação real, retornaria o usuário atualizado
  return Promise.resolve();
};
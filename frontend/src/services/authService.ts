// Serviço para integração com API
// services/authService.ts

interface RegisterData {
  nome: string;
  telefone: string;
  senha: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  referencia: string;
}

interface UserResponse {
  id: string;
  nome: string;
  telefone: string;
  userType: string;
  points: number;
}

// Função para cadastrar novo usuário
export const registerUser = async (userData: RegisterData): Promise<UserResponse> => {
  try {
    // Aqui você implementaria a chamada real à sua API
    // const response = await fetch('sua-api/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(userData),
    // });
    
    // if (!response.ok) {
    //   throw new Error('Falha no cadastro');
    // }
    
    // return await response.json();
    
    // Como é um mock, vamos simular o comportamento:
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular latência
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      nome: userData.nome,
      telefone: userData.telefone,
      userType: 'comum',
      points: 0
    };
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error;
  }
};

// Validar formato de telefone
export const isValidPhone = (phone: string): boolean => {
  // Remove caracteres não numéricos
  const numericPhone = phone.replace(/\D/g, '');
  // Verifica se tem pelo menos 10 dígitos (DDD + número)
  return numericPhone.length >= 10 && numericPhone.length <= 11;
};

// Validar CEP
export const isValidCEP = (cep: string): boolean => {
  // Remove caracteres não numéricos
  const numericCEP = cep.replace(/\D/g, '');
  // CEP brasileiro tem 8 dígitos
  return numericCEP.length === 8;
};

// Buscar endereço pelo CEP usando a API ViaCEP
export const fetchAddressByCEP = async (cep: string) => {
  if (!isValidCEP(cep)) {
    throw new Error('CEP inválido');
  }
  
  const numericCEP = cep.replace(/\D/g, '');
  const response = await fetch(`https://viacep.com.br/ws/${numericCEP}/json/`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar CEP');
  }
  
  const data = await response.json();
  
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }
  
  return {
    logradouro: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf
  };
};
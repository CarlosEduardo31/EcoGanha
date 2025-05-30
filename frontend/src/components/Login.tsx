"use client"
import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';

export function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiConnected, setApiConnected] = useState(true);
  const router = useRouter();

  // Verificar a conexão com a API ao carregar o componente
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await authService.testConnection();
        setApiConnected(isConnected);
      } catch (error) {
        console.error('Erro ao verificar conexão com API:', error);
        setApiConnected(false);
      }
    };
    
    checkConnection();
    
    // Verificar se há token para evitar acesso à tela de login quando já autenticado
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            // Já está autenticado, redirecionar para dashboard apropriado
            redirectBasedOnUserType(user.userType);
          }
        } catch (error) {
          // Token inválido ou expirado, limpar
          authService.logout();
        }
      }
    };
    
    checkAuth();
  }, []);

  // Função para redirecionar baseado no tipo de usuário
  const redirectBasedOnUserType = (userType: string) => {
    if (userType === 'comum') {
      router.push('/dashboard/comum');
    } else if (userType === 'ecoponto') {
      router.push('/dashboard/ecoponto');
    } else if (userType === 'patrocinador') {
      router.push('/dashboard/patrocinador');
    } else {
      router.push('/dashboard');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Verificar se os campos estão preenchidos
    if (!phone.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }
    
    // Verificar se a API está conectada
    if (!apiConnected) {
      setError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
      setLoading(false);
      return;
    }
    
    try {
      // Chama o serviço de autenticação
      const user = await authService.login({ phone, password });
      
      // Feedback de sucesso
      console.log('Login realizado com sucesso!', user);
      
      // Solução mais robusta para redirecionamento após login
      // Usando window.location em vez de router.push para garantir uma navegação completa
      if (user.userType === 'comum') {
        window.location.href = '/dashboard/comum';
      } else if (user.userType === 'ecoponto') {
        window.location.href = '/dashboard/ecoponto';
      } else if (user.userType === 'patrocinador') {
        window.location.href = '/dashboard/patrocinador';
      } else {
        window.location.href = '/dashboard';
      }
      
      // Fallback caso o window.location não funcione por algum motivo
      setTimeout(() => {
        redirectBasedOnUserType(user.userType);
      }, 500);
      
    } catch (error: any) {
      // Tratamento detalhado de erros de API
      if (error.response) {
        // Erro retornado pelo servidor
        if (error.response.status === 401) {
          setError('Telefone ou senha incorretos. Por favor, tente novamente.');
        } else if (error.response.status === 404) {
          setError('Usuário não encontrado. Verifique se o telefone está correto.');
        } else {
          setError(error.response.data?.message || 'Falha no login. Verifique seu telefone e senha.');
        }
      } else if (error.request) {
        // Sem resposta do servidor
        setError('Servidor indisponível no momento. Tente novamente mais tarde.');
        setApiConnected(false);
      } else {
        // Erro na configuração da requisição
        setError('Erro ao processar sua solicitação. Por favor, tente novamente.');
      }
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar o telefone enquanto o usuário digita
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Formata o telefone
    let formattedValue = numericValue;
    if (numericValue.length <= 2) {
      formattedValue = numericValue;
    } else if (numericValue.length <= 6) {
      formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    } else if (numericValue.length <= 10) {
      formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
    } else {
      formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
    }
    
    setPhone(formattedValue);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logoSVG.svg"
          alt="EcoGanha Logo"
          width={120}
          height={120}
          className="w-24 h-24 sm:w-28 sm:h-28"
        />
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#FBCA27] py-4">
          <h2 className="text-center text-[#003F25] font-semibold text-xl">Entrar no EcoGanha</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Feedback de conexão com a API */}
          {!apiConnected && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="font-medium">Problemas de conexão!</p>
              <p className="text-sm">Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.</p>
            </div>
          )}
          
          {/* Feedback de erro */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="(81) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !apiConnected}
            className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Entrar'
            )}
          </button>
          
          {/* Esqueci minha senha */}
          <div className="text-center mt-2">
            <a href="#" className="text-sm text-[#003F25] hover:underline">
              Esqueci minha senha
            </a>
          </div>
        </form>
        
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <a href="/cadastro" className="text-[#003F25] font-medium hover:underline">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>EcoGanha - São João de Caruaru 2025</p>
      </div>
    </div>
  );
}
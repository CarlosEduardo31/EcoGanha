"use client"
// components/Login.tsx
import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(phone, password);
      // Redirecionar para a página correta após login
      router.push('/dashboard');
    } catch (error) {
      setError('Falha no login. Verifique seu telefone e senha.');
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => setPhone(e.target.value)}
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

          <div className="text-sm text-gray-500 italic">
            <p>Telefones dos usuários mocados:</p>
            <ul>
              <li>Usuário comum: 81999999999</li>
              <li>Eco Ponto: 81888888888</li>
              <li>Patrocinador: 81777777777</li>
              <li>Usuário VIP: 81666666666</li>
            </ul>
            <p>Qualquer senha funciona para teste</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 flex justify-center"
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
        </form>
        
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <a href="#" className="text-[#003F25] font-medium hover:underline">
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
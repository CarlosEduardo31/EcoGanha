"use client"
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function UsuarioComumPage() {
  const { user, isAuthenticated, findUserByPhone, removePoints, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.userType !== 'comum') {
      router.push(`/dashboard/${user?.userType}`);
    }
  }, [isAuthenticated, user, router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25]"></div>
      </div>
    );
  }

  // Componentes para cada tab
  const renderHomeTab = () => (
    <>
      {/* Perfil e pontos */}
      <div className="bg-[#FBCA27] rounded-lg p-4 shadow-md mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mt-2">
            <div className="relative">
              <Image
                src={"/IconPerfil.svg"}
                alt="Perfil"
                width={80}
                height={80}
                className="w-20 h-20"
              />
              <span className="absolute bottom-0 right-0 bg-[#003F25] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                1
              </span>
            </div>
          </div>
          <h1 className="text-[#003E25] font-semibold text-xl mt-2">{user.name}</h1>
          <div className="bg-white rounded-full px-4 py-1 inline-block mt-2 shadow-sm">
            <p className="text-[#003F25] font-bold">{user.points} EcoPontos</p>
          </div>
        </div>
      </div>

      {/* Histórico de Atividades */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#003F25] font-semibold text-lg">Suas Atividades</h2>
          <button className="text-sm text-[#003F25]">Ver todas</button>
        </div>
        <div className="space-y-3">
          {user.points > 0 ? (
            <>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Reciclagem de Plástico</p>
                    <p className="text-sm text-gray-500">Hoje às 14:30</p>
                  </div>
                </div>
                <span className="text-green-600 font-medium">+150 pontos</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Reciclagem de Vidro</p>
                    <p className="text-sm text-gray-500">Ontem às 10:15</p>
                  </div>
                </div>
                <span className="text-green-600 font-medium">+250 pontos</span>
              </div>
            </>
          ) : (
            <p className="text-center py-4 text-gray-500">
              Nenhuma atividade registrada ainda. Visite um Eco Ponto para reciclar e ganhar pontos!
            </p>
          )}
        </div>
      </div>

      {/* Cards de Destaques */}
      <div className="mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-3">Destaques</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#FBCA27]">
            <div className="text-3xl font-bold text-[#003F25] mb-2">{user.points}</div>
            <div className="text-sm text-gray-600">Pontos acumulados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-[#003F25] mb-2">2</div>
            <div className="text-sm text-gray-600">Itens reciclados</div>
          </div>
        </div>
      </div>

      {/* Próximos Descontos Disponíveis */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[#003F25] font-semibold text-lg">Ofertas em Destaque</h2>
          <button 
            className="text-sm text-[#003F25]"
            onClick={() => setActiveTab('rewards')}
          >
            Ver mais
          </button>
        </div>
        
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex space-x-4 w-max">
            <div className="bg-gray-50 rounded-lg p-3 min-w-[200px] border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <Image 
                  src="/IconBoticario.svg" 
                  alt="O Boticário" 
                  width={40} 
                  height={40}
                  className="mr-2"
                />
                <h3 className="font-medium">O Boticário</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">20% de desconto em qualquer produto</p>
              <div className="flex justify-between items-center">
                <span className="text-[#003F25] font-medium">500 pontos</span>
                <button className="bg-[#003F25] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#002918] transition-colors">
                  Resgatar
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 min-w-[200px] border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <Image 
                  src="/IconIfood.svg" 
                  alt="iFood" 
                  width={40} 
                  height={40}
                  className="mr-2"
                />
                <h3 className="font-medium">iFood</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">R$15 de desconto em pedidos</p>
              <div className="flex justify-between items-center">
                <span className="text-[#003F25] font-medium">300 pontos</span>
                <button className="bg-[#003F25] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#002918] transition-colors">
                  Resgatar
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 min-w-[200px] border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <Image 
                  src="/IconAssai.svg" 
                  alt="Assaí" 
                  width={40} 
                  height={40}
                  className="mr-2"
                />
                <h3 className="font-medium">Assaí</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">10% em frutas e verduras</p>
              <div className="flex justify-between items-center">
                <span className="text-[#003F25] font-medium">400 pontos</span>
                <button className="bg-[#003F25] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#002918] transition-colors">
                  Resgatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderRewardsTab = () => (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-4">Todos os Parceiros</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Boticário */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-3">
              <Image 
                src="/IconBoticario.svg" 
                alt="O Boticário" 
                width={48} 
                height={48}
                className="mr-3"
              />
              <h3 className="font-semibold text-lg">O Boticário</h3>
            </div>
            
            <div className="space-y-3">
              <div className="border-t pt-3">
                <p className="font-medium mb-1">20% de desconto em qualquer produto</p>
                <p className="text-sm text-gray-600 mb-2">Válido para compras acima de R$100</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#003F25] font-medium">500 pontos</span>
                  <button className="bg-[#003F25] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#002918] transition-colors">
                    Resgatar
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <p className="font-medium mb-1">Cupom de R$50</p>
                <p className="text-sm text-gray-600 mb-2">Válido para compras acima de R$150</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#003F25] font-medium">800 pontos</span>
                  <button className="bg-[#003F25] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#002918] transition-colors">
                    Resgatar
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* iFood */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-3">
              <Image 
                src="/IconIfood.svg" 
                alt="iFood" 
                width={48} 
                height={48}
                className="mr-3"
              />
              <h3 className="font-semibold text-lg">iFood</h3>
            </div>
            
            <div className="space-y-3">
              <div className="border-t pt-3">
                <p className="font-medium mb-1">R$15 de desconto</p>
                <p className="text-sm text-gray-600 mb-2">Válido para pedidos acima de R$30</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#003F25] font-medium">300 pontos</span>
                  <button className="bg-[#003F25] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#002918] transition-colors">
                    Resgatar
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Outros parceiros... */}
        </div>
      </div>
    </div>
  );

  const renderMapTab = () => (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-4">Eco Pontos Próximos</h2>
        
        {/* Mapa (placeholder) */}
        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
          <p className="text-gray-500">Mapa dos Eco Pontos</p>
        </div>
        
        <div className="space-y-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-medium text-[#003F25]">Eco Ponto Centro</h3>
            <p className="text-sm text-gray-600 mt-1">Av. Agamenon Magalhães, 123, Centro</p>
            <p className="text-sm text-gray-600 mt-1">Horário: 8h às 18h (seg-sex), 9h às 14h (sáb)</p>
            <div className="flex space-x-2 mt-3">
              <button className="bg-[#003F25] text-white text-xs px-3 py-1.5 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ver no mapa
              </button>
              <button className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Ligar
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-medium text-[#003F25]">Eco Ponto Norte</h3>
            <p className="text-sm text-gray-600 mt-1">Rua São João, 456, Bairro Novo</p>
            <p className="text-sm text-gray-600 mt-1">Horário: 8h às 17h (seg-sex)</p>
            <div className="flex space-x-2 mt-3">
              <button className="bg-[#003F25] text-white text-xs px-3 py-1.5 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ver no mapa
              </button>
              <button className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Ligar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center">
            <Image
              src={"/IconPerfil.svg"}
              alt="Perfil"
              width={100}
              height={100}
              className="w-24 h-24"
            />
          </div>
          <h1 className="text-[#003E25] font-semibold text-xl mt-2">{user.name}</h1>
          <p className="text-gray-500">{user.phone}</p>
          <div className="bg-[#FBCA27] rounded-full px-4 py-1 inline-block mt-2">
            <p className="text-[#003F25] font-bold">{user.points} EcoPontos</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="text-[#003F25] font-semibold mb-3">Preferências</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Notificações</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003F25]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Receber novidades por email</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003F25]"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-[#003F25] font-semibold mb-3">Sobre</h2>
            <p className="text-sm text-gray-600">
              O EcoGanha é uma iniciativa para tornar Caruaru mais sustentável durante o São João, oferecendo pontos por reciclagem que podem ser trocados por descontos e prêmios.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <button 
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 mt-2"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Conteúdo principal baseado na tab ativa */}
      {activeTab === 'home' && renderHomeTab()}
      {activeTab === 'rewards' && renderRewardsTab()}
      {activeTab === 'map' && renderMapTab()}
      {activeTab === 'profile' && renderProfileTab()}

      {/* Navegação inferior estilo app */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-2 py-3 flex justify-around items-center">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'home' ? 'text-[#003F25]' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'home' ? 'bg-[#FBCA27]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="text-xs mt-1">Início</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('rewards')}
          className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'rewards' ? 'text-[#003F25]' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'rewards' ? 'bg-[#FBCA27]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Prêmios</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'map' ? 'text-[#003F25]' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'map' ? 'bg-[#FBCA27]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Eco Pontos</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center w-1/4 ${activeTab === 'profile' ? 'text-[#003F25]' : 'text-gray-500'}`}
        >
          <div className={`p-2 rounded-full ${activeTab === 'profile' ? 'bg-[#FBCA27]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
}
import React from 'react';
import Image from 'next/image';
import { User } from '@/contexts/AuthContext';

interface ProfileTabProps {
  user: User;
  onLogout: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, onLogout }) => {
  return (
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
          <p className="text-[#003F25] font-bold">Parceiro EcoGanha</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="border-t pt-4">
          <h2 className="text-[#003F25] font-semibold mb-3">Informações do Estabelecimento</h2>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-600 mt-1">Localizado no Stand do São João, Pátio de Eventos</p>
          <p className="text-sm text-gray-600 mt-1">Tel: {user.phone}</p>
        </div>
        
        <div className="border-t pt-4">
          <h2 className="text-[#003F25] font-semibold mb-3">Sobre o EcoGanha</h2>
          <p className="text-sm text-gray-600">
            O EcoGanha é uma iniciativa para tornar Caruaru mais sustentável durante o São João.
            Como parceiro, você oferece incentivos e recompensas para os usuários que reciclam,
            ajudando a cidade e o meio ambiente.
          </p>
        </div>
        
        <div className="border-t pt-4">
          <h2 className="text-[#003F25] font-semibold mb-3">Contato</h2>
          <p className="text-sm text-gray-600">
            Para suporte técnico, entre em contato pelo telefone (81) 3333-4444 ou pelo email suporte@ecoganha.com.br
          </p>
        </div>
        
        <div className="border-t pt-4">
          <button 
            onClick={onLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 mt-2"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
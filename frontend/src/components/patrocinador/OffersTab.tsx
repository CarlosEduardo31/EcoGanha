import React, { useState } from 'react';
import { Offer } from '@/types/patrocinador';

interface OffersTabProps {
  offers: Offer[];
  onAddOffer: (offer: Offer) => void;
  onUpdateOffer: (offer: Offer) => void;
  onDeleteOffer: (offerId: string) => void;
}

const OffersTab: React.FC<OffersTabProps> = ({ 
  offers,
  onAddOffer,
  onUpdateOffer,
  onDeleteOffer
}) => {
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPoints, setFormPoints] = useState('');

  const handleAddClick = () => {
    setIsAddingOffer(true);
    setEditingOfferId(null);
    setFormTitle('');
    setFormDescription('');
    setFormPoints('');
  };

  const handleEditClick = (offer: Offer) => {
    setIsAddingOffer(false);
    setEditingOfferId(offer.id);
    setFormTitle(offer.title);
    setFormDescription(offer.description);
    setFormPoints(offer.points.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formTitle || !formDescription || !formPoints) {
      return; // Form validation
    }
    
    const offerData: Offer = {
      id: editingOfferId || `new-${Date.now()}`,
      title: formTitle,
      description: formDescription,
      points: parseInt(formPoints)
    };
    
    if (isAddingOffer) {
      onAddOffer(offerData);
    } else if (editingOfferId) {
      onUpdateOffer(offerData);
    }
    
    // Reset form
    setIsAddingOffer(false);
    setEditingOfferId(null);
    setFormTitle('');
    setFormDescription('');
    setFormPoints('');
  };

  const cancelForm = () => {
    setIsAddingOffer(false);
    setEditingOfferId(null);
    setFormTitle('');
    setFormDescription('');
    setFormPoints('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#003F25] font-semibold text-lg">Minhas Ofertas</h2>
        {!isAddingOffer && !editingOfferId && (
          <button 
            onClick={handleAddClick}
            className="bg-[#003F25] text-white px-3 py-1 rounded-md hover:bg-[#002918] transition duration-200 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nova Oferta
          </button>
        )}
      </div>
      
      {(isAddingOffer || editingOfferId) && (
        <div className="border border-gray-200 rounded-md p-4 mb-4">
          <h3 className="font-medium text-lg mb-3">
            {isAddingOffer ? 'Adicionar Nova Oferta' : 'Editar Oferta'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da Oferta
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                placeholder="Ex: 20% de desconto em qualquer produto"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                placeholder="Ex: Válido para compras acima de R$100"
                rows={2}
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontos Necessários
              </label>
              <input
                type="number"
                value={formPoints}
                onChange={(e) => setFormPoints(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                placeholder="Ex: 500"
                min="1"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={cancelForm}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition duration-200"
              >
                {isAddingOffer ? 'Adicionar' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Lista de ofertas */}
      <div className="space-y-3">
        {offers.length === 0 ? (
          <p className="text-center py-4 text-gray-500">
            Nenhuma oferta cadastrada ainda.
          </p>
        ) : (
          offers.map((offer) => (
            <div 
              key={offer.id} 
              className="border rounded-md p-3 transition-colors border-gray-200 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{offer.title}</h4>
                  <p className="text-sm text-gray-500">{offer.description}</p>
                </div>
                <div className="text-[#003F25] font-semibold">
                  {offer.points} pontos
                </div>
              </div>
              
              {!isAddingOffer && !editingOfferId && (
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => handleEditClick(offer)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteOffer(offer.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OffersTab;
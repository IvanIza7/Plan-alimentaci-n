import React, { useState } from 'react';
import { X, ArrowDown, Check } from 'lucide-react';
import { equivalencesData } from '../data/equivalences';
import { useAppData } from '../hooks/useAppData';

interface SwapModalProps {
  ingredient: any;
  onClose: () => void;
  onSwap: (newIngredient: any) => void;
}

export default function EquivalenceSwapModal({ ingredient, onClose, onSwap }: SwapModalProps) {
  const { inventory } = useAppData();
  
  const getCategory = () => {
    const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/s$/, '').replace(/es$/, '');
    const ingN = normalize(ingredient.name);

    let cat = equivalencesData.find(c => 
      c.items.some(item => {
        const itemN = normalize(item.name);
        return ingN.includes(itemN) || itemN.includes(ingN);
      })
    );
    if (cat) return cat;

    if (ingN.includes('fruta') || ingN.includes('mango') || ingN.includes('sandia') || ingN.includes('melon') || ingN.includes('papaya') || ingN.includes('pina') || ingN.includes('manzana') || ingN.includes('platano') || ingN.includes('kiwi') || ingN.includes('tuna') || ingN.includes('ciruela') || ingN.includes('naranja') || ingN.includes('uva')) {
      return equivalencesData.find(c => c.id === 'fruta');
    }
    if (ingN.includes('queso') || ingN.includes('huevo') || ingN.includes('pollo') || ingN.includes('pavo') || ingN.includes('res') || ingN.includes('carne') || ingN.includes('atun') || ingN.includes('salchicha') || ingN.includes('pescado') || ingN.includes('surimi') || ingN.includes('deshebrada') || ingN.includes('cerdo')) {
      return equivalencesData.find(c => c.id === 'origen_animal');
    }
    if (ingN.includes('pan') || ingN.includes('tortilla') || ingN.includes('tostada') || ingN.includes('arroz') || ingN.includes('avena') || ingN.includes('cereal') || ingN.includes('bisquet') || ingN.includes('cuernito') || ingN.includes('fideo')) {
      return equivalencesData.find(c => c.id === 'cereales');
    }
    if (ingN.includes('leche') || ingN.includes('yogurt') || ingN.includes('crema')) {
      return equivalencesData.find(c => c.id === 'leche');
    }
    if (ingN.includes('sopa') || ingN.includes('ensalada') || ingN.includes('verdura') || ingN.includes('nopal') || ingN.includes('rajas') || ingN.includes('brocoli') || ingN.includes('cebolla') || ingN.includes('espinaca')) {
      return equivalencesData.find(c => c.id === 'verduras_b');
    }

    return equivalencesData[0];
  };

  const category = getCategory();
  const availableEquivalences = category ? category.items : equivalencesData[0].items;

  return (
    <div className="fixed inset-0 bg-text-main/20  z-[100] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-surface border-2 border-text-main rounded-[32px] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto neo-card shadow-[8px_8px_0_0_var(--color-text-main)] custom-scrollbar relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-[#ef4444] border-2 border-text-main rounded-full flex items-center justify-center text-white shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-red-600 hover:-translate-y-0.5 transition-all z-10 neo-btn">
          <X size={20} strokeWidth={3} />
        </button>

        <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Alimento a cambiar</h4>
        
        {/* Original Item */}
        <div className="bg-surface border-2 border-text-main rounded-[24px] p-4 flex items-center gap-4 shadow-[4px_4px_0_0_var(--color-text-main)] mb-6">
           <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-2xl shrink-0 border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">
              {ingredient.icon || '🍽️'}
           </div>
           <div className="flex-1">
              <h5 className="font-bold text-text-main">{ingredient.name}</h5>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{ingredient.qty}</p>
           </div>
           <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] ${ingredient.ready === false ? 'bg-[#ef4444] text-white' : 'bg-[#bef264] text-text-main'}`}>
              {ingredient.ready === false ? 'Falta en inventario' : 'Listo'}
           </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center mb-6 relative">
           <div className="w-10 h-10 rounded-full bg-text-main text-surface flex items-center justify-center border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] z-10">
              <ArrowDown size={20} />
           </div>
           <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-text-main -z-10"></div>
        </div>

        {ingredient.customEquivalences && ingredient.customEquivalences.length > 0 && (
           <>
              <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Opciones Alternativas del Menú</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                 {ingredient.customEquivalences.map((eq: any, idx: number) => {
                    const invItem = inventory.find((i: any) => i.name.toLowerCase().includes(eq.name.toLowerCase()));
                    const icon = invItem ? invItem.icon : eq.icon || '🥑';
                    const isInInventory = !!invItem;
                    return (
                       <button 
                          key={`custom-${idx}`} 
                          onClick={() => onSwap({ name: eq.name, qty: eq.qty, icon, ready: true })}
                          className="w-full bg-orange-400 border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-[24px] p-4 flex items-center gap-4 hover:bg-orange-500 hover:-translate-y-1 transition-all text-left neo-btn"
                       >
                          <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-2xl shrink-0 border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">
                             {icon}
                          </div>
                          <div className="flex-1">
                             <h5 className="font-bold text-surface leading-tight">{eq.name}</h5>
                             <p className="text-[10px] font-black uppercase tracking-widest text-text-main mt-1">{eq.qty}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-full border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] flex items-center justify-center shrink-0 ${isInInventory ? 'bg-[#bef264]' : 'bg-[#ef4444]'}`}>
                             {isInInventory ? <Check size={18} strokeWidth={3} className="text-text-main" /> : <X size={18} strokeWidth={3} className="text-white" />}
                          </div>
                       </button>
                    );
                 })}
              </div>
           </>
        )}

        <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Equivalencias Disponibles</h4>

        {/* Equivalences List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {availableEquivalences.map((eq, idx) => {
              // Try to find icon in real inventory or assign a default
              const invItem = inventory.find(i => i.name.toLowerCase().includes(eq.name.toLowerCase()) || eq.name.toLowerCase().includes(i.name.toLowerCase()));
              const icon = invItem ? invItem.icon : '🥑';
              const isInInventory = !!invItem;
              
              return (
                 <button 
                    key={idx} 
                    onClick={() => onSwap({ name: eq.name, qty: eq.amount, icon, ready: true })}
                    className="w-full bg-[#fef08a] border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-[24px] p-4 flex items-center gap-4 hover:bg-[#fde047] hover:-translate-y-1 transition-all text-left neo-btn"
                 >
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-2xl shrink-0 border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">
                       {icon}
                    </div>
                    <div className="flex-1">
                       <h5 className="font-bold text-text-main leading-tight">{eq.name}</h5>
                       <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mt-1">{eq.amount}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] flex items-center justify-center shrink-0 ${isInInventory ? 'bg-[#bef264]' : 'bg-[#ef4444]'}`}>
                       {isInInventory ? <Check size={18} strokeWidth={3} className="text-text-main" /> : <X size={18} strokeWidth={3} className="text-white" />}
                    </div>
                 </button>
              );
           })}
        </div>
      </div>
    </div>
  );
}

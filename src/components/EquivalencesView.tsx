import React, { useState } from 'react';
import { Search, Info, ChevronDown, ArrowDown, Check } from 'lucide-react';
import { equivalencesData, EquivalentCategory } from '../data/equivalences';
import FoodItem from './FoodItem';

export default function EquivalencesView() {
  const [tab, setTab] = useState<'sugerencias' | 'catalogo'>('sugerencias');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const filteredData = equivalencesData.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="pt-2">
         <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-1">
            {tab === 'sugerencias' ? 'Sustituciones Seguras' : 'Listado SMAE'}
         </p>
         <h1 className="text-3xl md:text-4xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight uppercase">Equivalencias</h1>
      </header>

      {/* Segmented Control */}
      <div className="flex bg-surface border-2 border-text-main rounded-full p-1 shadow-[4px_4px_0_0_var(--color-text-main)]">
         <button 
            onClick={() => setTab('sugerencias')}
            className={`flex-1 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${tab === 'sugerencias' ? 'bg-primary-900 text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'text-text-secondary hover:text-text-main'}`}
         >
            Faltantes
         </button>
         <button 
            onClick={() => setTab('catalogo')}
            className={`flex-1 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${tab === 'catalogo' ? 'bg-primary-900 text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'text-text-secondary hover:text-text-main'}`}
         >
            Catálogo SMAE
         </button>
      </div>
      
      {tab === 'sugerencias' ? (
         <>
            <div className="bg-accent-100 rounded-[28px] p-6 border-2 border-text-main shadow-[6px_6px_0_0_var(--color-text-main)] flex flex-col gap-2">
               <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span> Cambia sin romper tu plan
               </h3>
               <p className="text-xs font-bold text-text-secondary leading-relaxed">
                  Selecciona un alimento faltante de tu menú para ver por qué otros puedes intercambiarlo respetando las porciones de su categoría.
               </p>
            </div>
            <div className="mt-2 space-y-8">
               <EquivalenceCard
                   original={{ icon: '🍈', name: 'Melón', qty: '1 taza', status: 'missing', statusText: 'Agotado' }}
                  substitutes={[
                     { icon: '🍓', name: 'Fresa', qty: '1 taza' },
                     { icon: '🍎', name: 'Manzana', qty: '1/2 pza. med.' },
                     { icon: '🍉', name: 'Sandía', qty: '1 taza' }
                  ]}
               />
               
               <EquivalenceCard
                   original={{ icon: '🥛', name: 'Leche entera', qty: '240 ml.', status: 'missing', statusText: 'Agotado' }}
                  substitutes={[
                     { icon: '🍶', name: 'Yogurt natural', qty: '1 taza' },
                     { icon: '🥣', name: 'Leche evaporada', qty: '1/2 taza' }
                  ]}
               />
            </div>
         </>
      ) : (
         <>
            <div className="bg-accent-100 rounded-[28px] p-6 border-2 border-text-main shadow-[6px_6px_0_0_var(--color-text-main)] flex flex-col gap-2">
               <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-2">
                  <span className="text-lg">📏</span> Indicaciones de Medida
               </h3>
               <ul className="text-xs font-bold text-text-secondary leading-relaxed space-y-1">
                  <li>• <strong className="text-text-main">Cucharada:</strong> Cucharada sopera</li>
                  <li>• <strong className="text-text-main">Cucharadita:</strong> Cucharada cafetera</li>
                  <li>• <strong className="text-text-main">Taza:</strong> Taza medidora (240 ml)</li>
               </ul>
               <p className="text-xs font-black text-primary-900 mt-2 p-3 bg-primary-100 border border-primary-500 rounded-xl">
                 ⚠️ Por cada equivalente se puede elegir solo un alimento de la lista a la que correspondan.
               </p>
            </div>
            
            <div className="relative">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
               <input 
                  type="text" 
                  placeholder="Buscar alimento..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-surface border-2 border-text-main rounded-full py-4 pl-12 pr-4 font-bold text-sm text-text-main focus:outline-none focus:border-primary-500 shadow-[4px_4px_0_0_var(--color-text-main)]"
               />
            </div>

            <div className="space-y-4 mt-2">
               {filteredData.map((cat: EquivalentCategory) => {
                  const isExpanded = expandedCat === cat.id || searchTerm.length > 0;
                  return (
                     <div key={cat.id} className="bg-surface border-2 border-text-main rounded-[24px] overflow-hidden flex flex-col transition-all">
                        <button 
                           onClick={() => setExpandedCat(isExpanded && !searchTerm ? null : cat.id)} 
                           className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                        >
                           <div>
                              <h3 className="font-black text-sm uppercase tracking-widest text-text-main">{cat.name}</h3>
                              <p className="text-[10px] font-bold text-text-secondary mt-1 uppercase tracking-widest">
                                 {cat.kcal} kcal {cat.kcal > 0 && `| P: ${cat.macros.p}g C: ${cat.macros.c}g G: ${cat.macros.f}g`}
                              </p>
                           </div>
                           {!searchTerm && (
                              <ChevronDown size={20} className={`text-text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                           )}
                        </button>
                        
                        {isExpanded && (
                           <div className="p-4 border-t-2 border-border-subtle bg-background">
                              <div className="space-y-2">
                                 {cat.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-surface p-3 rounded-[16px] border border-border-subtle">
                                       <div>
                                          <p className="text-xs font-bold text-text-main">{item.name}</p>
                                          {item.notes && (
                                             <p className="text-[9px] font-black text-primary-600 mt-1 uppercase tracking-widest flex items-center gap-1">
                                                <Info size={10} /> {item.notes}
                                             </p>
                                          )}
                                       </div>
                                       <span className="text-[10px] font-black text-text-secondary bg-background px-3 py-1.5 rounded-full border border-border-subtle shrink-0 ml-4 text-center">
                                          {item.amount}
                                       </span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  )
               })}
            </div>
         </>
      )}
    </div>
  );
}

function EquivalenceCard({ original, substitutes }: any) {
   return (
      <div className="bg-surface border-2 border-text-main rounded-[32px] p-6 neo-card shadow-[6px_6px_0_0_var(--color-text-main)] flex flex-col gap-4">
         <div>
            <p className="text-[10px] font-black text-primary-700 uppercase tracking-widest mb-3">Alimento Faltante</p>
            <FoodItem {...original} />
         </div>
         <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-primary-900 border-2 border-text-main rounded-full w-10 h-10 flex items-center justify-center text-surface shadow-[2px_2px_0_0_var(--color-text-main)]">
               <ArrowDown size={18} />
            </div>
         </div>
         <div>
            <p className="text-[10px] font-black text-primary-700 uppercase tracking-widest mb-3">Equivalencias Disponibles</p>
            <div className="space-y-3">
               {substitutes.map((sub: any, i: number) => (
                  <div key={i} className="bg-background border-2 border-border-subtle hover:border-text-main p-4 rounded-[24px] flex items-center gap-4 transition-all cursor-pointer hover:shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1">
                     <div className="w-10 h-10 bg-surface rounded-[14px] border-2 border-text-main flex items-center justify-center text-xl shrink-0">
                        {sub.icon}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-text-main truncate">{sub.name}</p>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-0.5">{sub.qty}</p>
                     </div>
                     <button className="shrink-0 bg-surface border-2 border-text-main rounded-full w-8 h-8 flex items-center justify-center hover:bg-accent-500 transition-colors">
                        <Check size={14} className="text-text-main" />
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

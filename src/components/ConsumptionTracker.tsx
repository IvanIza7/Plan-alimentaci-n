import React, { useState } from 'react';
import { X, Check, ArrowRight, Plus, Info } from 'lucide-react';
import { equivalencesData } from '../data/equivalences';

interface Item {
  name: string;
  qty: string;
}

interface Meal {
  id: string;
  type: string;
  time: string;
  name: string;
  ingredients?: Item[];
  dishes?: any[];
}

interface TrackerProps {
  meal: Meal;
  onClose: () => void;
  onSave: (items: TrackedItem[]) => void;
}

export type TrackStatus = 'pending' | 'consumed' | 'substituted' | 'modified' | 'skipped' | 'added';

export interface TrackedItem {
  id: string;
  originalItem?: Item;
  actualItem?: Item;
  status: TrackStatus;
}

export default function ConsumptionTracker({ meal, onClose, onSave }: TrackerProps) {
  const allIngredients = [...(meal.ingredients || []), ...(meal.dishes || []).flatMap((d: any) => d.ingredients || [])];

  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>(() => 
    allIngredients.map((ing, i) => ({
      id: `orig-${i}`,
      originalItem: ing,
      status: 'pending'
    }))
  );
  
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [showEquivalences, setShowEquivalences] = useState(false);
  const [showAddExtra, setShowAddExtra] = useState(false);
  const [showQtyEditor, setShowQtyEditor] = useState(false);
  const [tempQty, setTempQty] = useState('');
  const [summaryMode, setSummaryMode] = useState(false);

  // Stats
  const consumedCount = trackedItems.filter(i => i.status === 'consumed' || i.status === 'substituted' || i.status === 'modified').length;
  const originalCount = allIngredients.length;
  const subCount = trackedItems.filter(i => i.status === 'substituted').length;
  const skippedCount = trackedItems.filter(i => i.status === 'skipped').length;
  const addedCount = trackedItems.filter(i => i.status === 'added').length;

  const updateItemsStatus = (ids: string[], status: TrackStatus, actualItem?: Item) => {
    setTrackedItems(prev => prev.map(item => {
      if (ids.includes(item.id)) {
        return { ...item, status, actualItem: actualItem || item.originalItem };
      }
      return item;
    }));
    setSelectedItemIds([]);
    setShowEquivalences(false);
    setShowQtyEditor(false);
  };

  const handleEquivalenceSelect = (equivName: string, equivAmount: string) => {
    if (selectedItemIds.length !== 1) return;
    updateItemsStatus([selectedItemIds[0]], 'substituted', { name: equivName, qty: equivAmount });
  };

  const handleAddExtra = (name: string, qty: string) => {
    const newItem = {
      id: `extra-${Date.now()}`,
      actualItem: { name, qty },
      status: 'added' as TrackStatus
    };
    setTrackedItems(prev => [...prev, newItem]);
    setShowAddExtra(false);
  };

  const handleSaveQty = () => {
    if (selectedItemIds.length !== 1) return;
    const singleItem = trackedItems.find(i => i.id === selectedItemIds[0]);
    updateItemsStatus([selectedItemIds[0]], 'modified', { name: singleItem?.originalItem?.name || '', qty: tempQty });
  };


  return (
    <div className="fixed inset-0 bg-text-main/80  z-[100] flex items-end sm:items-center justify-center animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300">
      <div className="bg-surface border-t-4 border-l-4 border-r-4 sm:border-b-4 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h3 className="text-2xl font-display font-black text-text-main uppercase tracking-tight leading-none mb-1">
              {summaryMode ? 'Resumen' : 'Registrar Consumo'}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{meal.type} · {meal.time}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-[#ef4444] border-2 border-text-main rounded-full flex items-center justify-center text-white shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-red-600 hover:-translate-y-0.5 transition-all neo-btn">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2 space-y-4">
          
          {showAddExtra ? (
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-4">Selecciona un alimento extra</h4>
              <div className="space-y-4">
                {equivalencesData.map(cat => (
                  <div key={cat.id} className="space-y-2">
                     <h5 className="text-[9px] font-black text-primary-700 bg-primary-100 px-3 py-1 rounded-full inline-block uppercase tracking-widest">{cat.name}</h5>
                     <div className="grid gap-2">
                       {cat.items.slice(0, 5).map((eq, i) => (
                          <button key={i} onClick={() => handleAddExtra(eq.name, eq.amount)} className="w-full text-left bg-surface border-2 border-border-subtle hover:border-text-main p-4 rounded-[16px] flex justify-between items-center transition-colors">
                             <span className="font-bold text-sm">{eq.name}</span>
                             <span className="text-[10px] font-black bg-background px-2 py-1 rounded-full">{eq.amount}</span>
                          </button>
                       ))}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          ) : summaryMode ? (
            <div className="space-y-6">
              <div className="bg-primary-100 border-2 border-primary-900 rounded-[24px] p-6 text-center">
                 <h4 className="font-display font-black text-4xl text-primary-900 mb-2">{consumedCount} / {originalCount}</h4>
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary-900">Alimentos consumidos del plan</p>
              </div>

              <div className="space-y-3">
                 {subCount > 0 && (
                   <div className="flex items-center gap-3 bg-accent-100 border-2 border-text-main p-4 rounded-[20px]">
                      <div className="w-8 h-8 rounded-full bg-surface border-2 border-text-main flex items-center justify-center font-black">🔄</div>
                      <div>
                         <p className="font-black text-sm uppercase tracking-widest">{subCount} sustitución{subCount > 1 ? 'es' : ''}</p>
                      </div>
                   </div>
                 )}
                 {skippedCount > 0 && (
                   <div className="flex items-center gap-3 bg-red-100 border-2 border-text-main p-4 rounded-[20px]">
                      <div className="w-8 h-8 rounded-full bg-surface border-2 border-text-main flex items-center justify-center font-black">─</div>
                      <div>
                         <p className="font-black text-sm uppercase tracking-widest">{skippedCount} no consumido{skippedCount > 1 ? 's' : ''}</p>
                      </div>
                   </div>
                 )}
                 {addedCount > 0 && (
                   <div className="flex items-center gap-3 bg-green-100 border-2 border-text-main p-4 rounded-[20px]">
                      <div className="w-8 h-8 rounded-full bg-surface border-2 border-text-main flex items-center justify-center font-black text-green-700">+</div>
                      <div>
                         <p className="font-black text-sm uppercase tracking-widest">{addedCount} alimento{addedCount > 1 ? 's' : ''} extra</p>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          ) : (selectedItemIds.length === 1 && showEquivalences) ? (
            // Equivalences View
            <div className="space-y-6">
              <div className="bg-background border-2 border-border-subtle p-4 rounded-[24px]">
                 <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Sustituyendo:</p>
                 <div className="flex justify-between items-center">
                    <span className="font-bold">{trackedItems.find(i => i.id === selectedItemIds[0])?.originalItem?.name}</span>
                    <span className="text-xs font-black bg-surface px-2 py-1 rounded-full border border-border-subtle">{trackedItems.find(i => i.id === selectedItemIds[0])?.originalItem?.qty}</span>
                 </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-4">Equivalencias permitidas</h4>
                <div className="space-y-4">
                  {equivalencesData.map(cat => (
                    <div key={cat.id} className="space-y-2">
                       <h5 className="text-[9px] font-black text-primary-700 bg-primary-100 px-3 py-1 rounded-full inline-block uppercase tracking-widest">{cat.name}</h5>
                       <div className="grid gap-2">
                         {cat.items.slice(0, 5).map((eq, i) => ( // Show first 5 for brevity in UI
                            <button key={i} onClick={() => handleEquivalenceSelect(eq.name, eq.amount)} className="w-full text-left bg-surface border-2 border-border-subtle hover:border-text-main p-4 rounded-[16px] flex justify-between items-center transition-colors">
                               <span className="font-bold text-sm">{eq.name}</span>
                               <span className="text-[10px] font-black bg-background px-2 py-1 rounded-full">{eq.amount}</span>
                            </button>
                         ))}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (selectedItemIds.length === 1 && showQtyEditor) ? (
            <div className="space-y-6">
              <div className="bg-background border-2 border-border-subtle p-4 rounded-[24px]">
                 <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Editando cantidad de:</p>
                 <div className="flex justify-between items-center">
                    <span className="font-bold">{trackedItems.find(i => i.id === selectedItemIds[0])?.originalItem?.name}</span>
                    <span className="text-xs font-black bg-surface px-2 py-1 rounded-full border border-border-subtle">{trackedItems.find(i => i.id === selectedItemIds[0])?.originalItem?.qty}</span>
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Nueva cantidad</label>
                 <input type="text" value={tempQty} onChange={(e) => setTempQty(e.target.value)} className="w-full bg-surface border-2 border-text-main rounded-xl p-4 font-bold text-text-main focus:outline-none shadow-[2px_2px_0_0_var(--color-text-main)]" placeholder="Ej: 1/2 taza" />
                 <button onClick={handleSaveQty} className="w-full mt-4 bg-accent-500 text-text-main font-black uppercase tracking-widest py-4 rounded-xl border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">Guardar Cambios</button>
               </div>
            </div>
          ) : (
            // Main List // Main List
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-2"><Info size={14}/> Selecciona para registrar</p>
              {trackedItems.map((item) => (
                <div key={item.id} onClick={() => {
                   if (item.status === 'pending') {
                      setSelectedItemIds(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]);
                   }
                }} className={`bg-surface border-2 border-text-main rounded-[24px] p-4 transition-all ${item.status === 'pending' ? (selectedItemIds.includes(item.id) ? 'shadow-[4px_4px_0_0_var(--color-text-main)] bg-blue-50 border-blue-500 scale-[1.02]' : 'shadow-[2px_2px_0_0_var(--color-text-main)] hover:shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1 cursor-pointer neo-card') : 'shadow-[4px_4px_0_0_var(--color-text-main)] bg-slate-100 opacity-70'}`}>
                   
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         {item.status === 'pending' && (
                            <div className={`w-5 h-5 rounded-md border-2 border-text-main flex items-center justify-center ${selectedItemIds.includes(item.id) ? 'bg-primary-500 text-surface' : 'bg-surface'}`}>
                               {selectedItemIds.includes(item.id) && <Check size={14} strokeWidth={4} />}
                            </div>
                         )}
                         <div>
                            <h4 className={`font-black text-sm uppercase tracking-widest ${item.status === 'skipped' ? 'line-through text-text-secondary' : 'text-text-main'}`}>{item.actualItem?.name || item.originalItem?.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest mt-1 bg-surface border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] px-2 py-0.5 rounded-full inline-block">{item.actualItem?.qty || item.originalItem?.qty}</p>
                         </div>
                      </div>
                      
                      {item.status === 'pending' ? (
                        null
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] ${item.status === 'consumed' ? 'bg-[#bef264] text-text-main' : item.status === 'substituted' ? 'bg-[#fef08a] text-text-main' : item.status === 'skipped' ? 'bg-[#ef4444] text-white' : 'bg-orange-400 text-text-main'}`}>
                              {item.status === 'consumed' && 'Listo'}
                              {item.status === 'substituted' && 'Sustituido'}
                              {item.status === 'skipped' && 'Omitido'}
                              {item.status === 'modified' && 'Modificado'}
                           </span>
                           <button onClick={(e) => { e.stopPropagation(); updateItemsStatus([item.id], 'pending'); }} className="text-[9px] font-black uppercase tracking-widest bg-surface border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] px-2 py-1 rounded-full hover:bg-slate-200 transition-colors">Deshacer</button>
                        </div>
                      )}
                   </div>
                   
                   {item.status === 'substituted' && item.originalItem && (
                     <div className="mt-3 pt-3 border-t-2 border-border-subtle text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                        Original: {item.originalItem.name}
                     </div>
                   )}
                </div>
              ))}
              
              {!summaryMode && selectedItemIds.length === 0 && (
                 <button onClick={() => setShowAddExtra(true)} className="w-full bg-orange-400 border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1 hover:bg-orange-500 transition-all neo-btn mt-4">
                    <Plus size={18} strokeWidth={3} /> Agregar alimento extra
                 </button>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t-2 border-border-subtle shrink-0">
           {(showAddExtra || showEquivalences || showQtyEditor) ? (
              <button onClick={() => { setSelectedItemIds([]); setShowEquivalences(false); setShowQtyEditor(false); setShowAddExtra(false); }} className="w-full py-4 text-xs font-black uppercase tracking-widest text-text-secondary hover:text-text-main">
                 Cancelar edición
              </button>
           ) : summaryMode ? (
              <button onClick={() => onSave(trackedItems)} className="w-full bg-primary-900 text-surface font-black text-sm uppercase tracking-widest py-4 rounded-full neo-btn hover:bg-primary-800 transition-colors shadow-[4px_4px_0_0_var(--color-text-main)] border-2 border-text-main">
                 Confirmar Consumo
              </button>
           ) : selectedItemIds.length > 0 ? (
              <div className="space-y-3">
                 <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary text-center mb-2">Acción para {selectedItemIds.length} alimento(s)</p>
                 <button onClick={() => updateItemsStatus(selectedItemIds, 'consumed')} className="w-full bg-[#bef264] text-text-main font-black uppercase tracking-widest py-3 rounded-xl border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] flex items-center justify-center gap-2 hover:bg-[#a3e635] hover:-translate-y-1 transition-all neo-btn">
                    Comí lo indicado
                 </button>
                 {selectedItemIds.length === 1 && (
                    <>
                       <button onClick={() => setShowEquivalences(true)} className="w-full bg-[#fef08a] text-text-main font-black uppercase tracking-widest py-3 rounded-xl border-2 border-text-main flex items-center justify-center gap-2 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-[#fde047] hover:-translate-y-1 transition-all neo-btn">
                          Cambié el alimento
                       </button>
                       <button onClick={() => { 
                          const singleItem = trackedItems.find(i => i.id === selectedItemIds[0]);
                          setTempQty(singleItem?.originalItem?.qty || ''); 
                          setShowQtyEditor(true); 
                       }} className="w-full bg-orange-400 text-text-main font-black uppercase tracking-widest py-3 rounded-xl border-2 border-text-main flex items-center justify-center gap-2 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-orange-500 hover:-translate-y-1 transition-all neo-btn">
                          Cambié la cantidad
                       </button>
                    </>
                 )}
                 <button onClick={() => updateItemsStatus(selectedItemIds, 'skipped')} className="w-full bg-[#ef4444] text-white font-black uppercase tracking-widest py-3 rounded-xl border-2 border-text-main flex items-center justify-center gap-2 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-red-600 hover:-translate-y-1 transition-all neo-btn">
                    No lo consumí
                 </button>
              </div>
           ) : (
              <button onClick={() => setSummaryMode(true)} disabled={trackedItems.some(i => i.status === 'pending')} className={`w-full font-black text-sm uppercase tracking-widest py-4 rounded-xl border-2 transition-all ${trackedItems.some(i => i.status === 'pending') ? 'bg-slate-200 border-text-main text-text-secondary cursor-not-allowed shadow-[4px_4px_0_0_var(--color-text-main)]' : 'bg-accent-400 border-text-main text-text-main neo-btn hover:bg-accent-500 hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)]'}`}>
                 Revisar Resumen
              </button>
           )}
        </div>

      </div>
    </div>
  );
}

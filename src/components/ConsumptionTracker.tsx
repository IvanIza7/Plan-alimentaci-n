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
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>(() => 
    (meal.ingredients || []).map((ing, i) => ({
      id: `orig-${i}`,
      originalItem: ing,
      status: 'pending'
    }))
  );
  
  const [activeItem, setActiveItem] = useState<TrackedItem | null>(null);
  const [showEquivalences, setShowEquivalences] = useState(false);
  const [showAddExtra, setShowAddExtra] = useState(false);
  const [showQtyEditor, setShowQtyEditor] = useState(false);
  const [tempQty, setTempQty] = useState('');
  const [summaryMode, setSummaryMode] = useState(false);

  // Stats
  const consumedCount = trackedItems.filter(i => i.status === 'consumed' || i.status === 'substituted' || i.status === 'modified').length;
  const originalCount = (meal.ingredients || []).length;
  const subCount = trackedItems.filter(i => i.status === 'substituted').length;
  const skippedCount = trackedItems.filter(i => i.status === 'skipped').length;
  const addedCount = trackedItems.filter(i => i.status === 'added').length;

  const updateItemStatus = (id: string, status: TrackStatus, actualItem?: Item) => {
    setTrackedItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status, actualItem: actualItem || item.originalItem };
      }
      return item;
    }));
    setActiveItem(null);
    setShowEquivalences(false);
    setShowQtyEditor(false);
  };

  const handleEquivalenceSelect = (equivName: string, equivAmount: string) => {
    if (!activeItem) return;
    updateItemStatus(activeItem.id, 'substituted', { name: equivName, qty: equivAmount });
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
    if (!activeItem) return;
    updateItemStatus(activeItem.id, 'modified', { name: activeItem.originalItem?.name || '', qty: tempQty });
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
          <button onClick={onClose} className="w-10 h-10 bg-background border-2 border-border-subtle rounded-full flex items-center justify-center text-text-secondary hover:text-text-main hover:border-text-main transition-colors">
            <X size={20} />
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
          ) : activeItem && showEquivalences ? (
            // Equivalences View
            <div className="space-y-6">
              <div className="bg-background border-2 border-border-subtle p-4 rounded-[24px]">
                 <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Sustituyendo:</p>
                 <div className="flex justify-between items-center">
                    <span className="font-bold">{activeItem.originalItem?.name}</span>
                    <span className="text-xs font-black bg-surface px-2 py-1 rounded-full border border-border-subtle">{activeItem.originalItem?.qty}</span>
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
          ) : activeItem && showQtyEditor ? (
            <div className="space-y-6">
              <div className="bg-background border-2 border-border-subtle p-4 rounded-[24px]">
                 <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Editando cantidad de:</p>
                 <div className="flex justify-between items-center">
                    <span className="font-bold">{activeItem.originalItem?.name}</span>
                    <span className="text-xs font-black bg-surface px-2 py-1 rounded-full border border-border-subtle">{activeItem.originalItem?.qty}</span>
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Nueva cantidad</label>
                 <input type="text" value={tempQty} onChange={(e) => setTempQty(e.target.value)} className="w-full bg-surface border-2 border-text-main rounded-xl p-4 font-bold text-text-main focus:outline-none shadow-[2px_2px_0_0_var(--color-text-main)]" placeholder="Ej: 1/2 taza" />
                 <button onClick={handleSaveQty} className="w-full mt-4 bg-accent-500 text-text-main font-black uppercase tracking-widest py-4 rounded-xl border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">Guardar Cambios</button>
              </div>
            </div>
          ) : activeItem && !showEquivalences ? (
            // Single Item Action Menu
            <div className="space-y-6">
              <div className="bg-surface border-2 border-text-main p-6 rounded-[24px] shadow-[4px_4px_0_0_var(--color-text-main)]">
                 <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-4 text-center">¿Qué hiciste con este alimento?</p>
                 <div className="text-center mb-6">
                    <h4 className="font-display font-black text-2xl uppercase tracking-tight">{activeItem.originalItem?.name}</h4>
                    <span className="inline-block mt-2 font-bold text-sm bg-background border-2 border-border-subtle px-4 py-1.5 rounded-full">{activeItem.originalItem?.qty}</span>
                 </div>
                 
                 <div className="space-y-3">
                    <button onClick={() => updateItemStatus(activeItem.id, 'consumed')} className="w-full bg-text-main text-surface font-black uppercase tracking-widest py-4 rounded-xl border-2 border-transparent flex items-center justify-center gap-2 hover:bg-black/80 transition-colors">
                       <Check size={18} /> Comí lo indicado
                    </button>
                    <button onClick={() => setShowEquivalences(true)} className="w-full bg-accent-100 text-text-main font-black uppercase tracking-widest py-4 rounded-xl border-2 border-text-main flex items-center justify-center gap-2 shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-accent-200 transition-colors">
                       🔄 Cambié el alimento
                    </button>
                    <button onClick={() => { setTempQty(activeItem.originalItem?.qty || ''); setShowQtyEditor(true); }} className="w-full bg-surface text-text-main font-black uppercase tracking-widest py-4 rounded-xl border-2 border-text-main flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
     ✏️ Cambié la cantidad
  </button>
  <button onClick={() => updateItemStatus(activeItem.id, 'skipped')} className="w-full bg-surface text-text-main font-black uppercase tracking-widest py-4 rounded-xl border-2 border-text-main flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                       ✕ No lo consumí
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            // Main List
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-2"><Info size={14}/> Selecciona para registrar</p>
              {trackedItems.map((item) => (
                <div key={item.id} onClick={() => item.status === 'pending' && setActiveItem(item)} className={`bg-surface border-2 rounded-[24px] p-4 transition-all ${item.status === 'pending' ? 'border-border-subtle hover:border-text-main cursor-pointer' : 'border-text-main shadow-[4px_4px_0_0_var(--color-text-main)]'}`}>
                   
                   <div className="flex justify-between items-center">
                      <div>
                         <h4 className={`font-black text-sm uppercase tracking-widest ${item.status === 'skipped' ? 'line-through text-text-secondary' : 'text-text-main'}`}>{item.actualItem?.name || item.originalItem?.name}</h4>
                         <p className="text-xs font-bold text-text-secondary mt-1">{item.actualItem?.qty || item.originalItem?.qty}</p>
                      </div>
                      
                      {item.status === 'pending' ? (
                        <div className="w-8 h-8 rounded-full border-2 border-border-subtle flex items-center justify-center text-text-secondary">
                           <ArrowRight size={14} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${item.status === 'consumed' ? 'bg-green-100 text-green-700' : item.status === 'substituted' ? 'bg-accent-100 text-accent-700' : item.status === 'skipped' ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700'}`}>
                              {item.status === 'consumed' && '✓ Listo'}
                              {item.status === 'substituted' && '🔄 Sustituido'}
                              {item.status === 'skipped' && '✕ Omitido'}
                           </span>
                           <button onClick={(e) => { e.stopPropagation(); updateItemStatus(item.id, 'pending'); }} className="text-[9px] font-bold text-text-secondary underline mt-1">Deshacer</button>
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
              
              {!summaryMode && !activeItem && (
                 <button onClick={() => setShowAddExtra(true)} className="w-full bg-background border-2 border-dashed border-border-subtle hover:border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-[24px] flex items-center justify-center gap-2 transition-colors mt-4">
                    <Plus size={16} /> Agregar alimento extra
                 </button>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t-2 border-border-subtle shrink-0">
           {(activeItem || showAddExtra) ? (
              <button onClick={() => { setActiveItem(null); setShowEquivalences(false); setShowQtyEditor(false); setShowAddExtra(false); }} className="w-full py-4 text-xs font-black uppercase tracking-widest text-text-secondary hover:text-text-main">
                 Cancelar edición
              </button>
           ) : summaryMode ? (
              <button onClick={() => onSave(trackedItems)} className="w-full bg-primary-900 text-surface font-black text-sm uppercase tracking-widest py-4 rounded-full neo-btn hover:bg-primary-800 transition-colors shadow-[4px_4px_0_0_var(--color-text-main)] border-2 border-text-main">
                 Confirmar Consumo
              </button>
           ) : (
              <button onClick={() => setSummaryMode(true)} disabled={trackedItems.some(i => i.status === 'pending')} className={`w-full font-black text-sm uppercase tracking-widest py-4 rounded-full border-2 transition-all ${trackedItems.some(i => i.status === 'pending') ? 'bg-background border-border-subtle text-text-secondary cursor-not-allowed' : 'bg-accent-500 border-text-main text-text-main neo-btn hover:bg-accent-400 shadow-[4px_4px_0_0_var(--color-text-main)]'}`}>
                 Revisar Resumen
              </button>
           )}
        </div>

      </div>
    </div>
  );
}

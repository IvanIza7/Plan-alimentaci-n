import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, X, Trash2, History } from 'lucide-react';
import { useAppData, ShoppingItem } from '../hooks/useAppData';

const CATEGORIES = [
   'Frutas y Verduras',
   'Carnes, Aves y Pescados',
   'Lácteos y Huevo',
   'Panadería y Cereales',
   'Abarrotes y Despensa',
   'Bebidas e Infusiones',
   'Otros'
];


const NumberStepper = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
   return (
      <div className="flex items-center justify-between bg-surface border-2 border-text-main rounded-xl overflow-hidden shadow-[4px_4px_0_0_var(--color-text-main)] w-full">
         <button onClick={() => onChange(Math.max(1, value - 1))} className="w-12 h-12 flex items-center justify-center bg-primary-100 hover:bg-primary-200 border-r-2 border-text-main text-xl font-black transition-colors">-</button>
         <div className="flex-1 text-center font-black text-xl">{value}</div>
         <button onClick={() => onChange(value + 1)} className="w-12 h-12 flex items-center justify-center bg-primary-100 hover:bg-primary-200 border-l-2 border-text-main text-xl font-black transition-colors">+</button>
      </div>
   );
};

export default function ShoppingView() {
  const { shoppingList, addShoppingItem, updateShoppingItem, deleteShoppingItem, shoppingHistory, saveShoppingHistory, inventory } = useAppData();
  
  const [view, setView] = useState<'list'|'history'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addAmount, setAddAmount] = useState(1);
  const [addUnit, setAddUnit] = useState('piezas');
  const [addCat, setAddCat] = useState(CATEGORIES[0]);
  const [addIcon, setAddIcon] = useState('🛒');
  const [addMode, setAddMode] = useState<'inventory'|'custom'>('inventory');
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const items = shoppingList || [];
  
  const toggleItem = (item: ShoppingItem) => {
    updateShoppingItem(item.id, { checked: !item.checked });
  };
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
     e.stopPropagation();
     deleteShoppingItem(id);
  };
  
  const handleOpenModal = () => {
     setShowAddModal(true);
     setAddMode('inventory');
     setSearchTerm('');
  };

  const handleSaveNew = () => {
     if (!addName) return;
     addShoppingItem({
        name: addName,
        qty: `${addAmount} ${addUnit}`,
        category: addCat.toUpperCase(),
        icon: addIcon,
        checked: false
     });
     setShowAddModal(false);
     setAddName('');
     setAddAmount(1);
     setAddUnit('piezas');
     setAddIcon('🛒');
  };
  
  const handleFinishShopping = () => {
     const checkedItems = items.filter(i => i.checked);
     if (checkedItems.length > 0) {
        saveShoppingHistory(checkedItems);
        // Optional: remove them from shopping list
        checkedItems.forEach(i => deleteShoppingItem(i.id));
     }
  };

  const categories = Array.from(new Set(items.map(i => i.category)));
  const total = items.length;
  const completed = items.filter(i => i.checked).length;
  const toBuy = total - completed;
  const progress = total === 0 ? 0 : (completed / total) * 100;
  
  // Group history by year/month
  const historyGroups = shoppingHistory?.reduce((acc, log) => {
     const d = new Date(log.date);
     const year = d.getFullYear().toString();
     const month = d.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
     if (!acc[year]) acc[year] = {};
     if (!acc[year][month]) acc[year][month] = [];
     acc[year][month].push(log);
     return acc;
  }, {} as Record<string, Record<string, typeof shoppingHistory>>) || {};

  return (
    <div className="flex flex-col gap-6 pb-32">
      <header className="pt-2">
         <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-1">Lista Actualizada</p>
         <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight uppercase">Compras</h1>
            <button onClick={() => setView(view === 'list' ? 'history' : 'list')} className="w-10 h-10 rounded-full border-2 border-text-main flex items-center justify-center bg-surface neo-btn">
               {view === 'list' ? <History size={18} /> : <CheckCircle2 size={18} />}
            </button>
         </div>
      </header>

      {view === 'list' ? (
         <>
            {/* Hero Card */}
            <div className="bg-primary-900 rounded-[32px] p-8 text-surface shadow-[8px_8px_0_0_var(--color-text-main)] border-2 border-text-main flex flex-col relative overflow-hidden">
               <p className="text-[11px] font-bold text-primary-100 mb-6 relative z-10">Lo que necesitas para cumplir tu plan.</p>
               <div className="flex justify-between items-end mb-4 relative z-10">
                  <div>
                     <span className="text-6xl font-display font-black text-surface leading-none">{toBuy}</span>
                     <p className="text-[10px] uppercase tracking-widest text-primary-300 mt-2 font-bold">por comprar</p>
                  </div>
                  <div className="text-right">
                     <span className="text-xl font-display font-black text-accent-500">{completed}/{total}</span>
                     <p className="text-[9px] uppercase tracking-widest text-primary-300 font-bold">completados</p>
                  </div>
               </div>
               <div className="h-3.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner relative z-10">
                  <div className="h-full bg-accent-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
            
            {completed > 0 && (
               <button onClick={handleFinishShopping} className="w-full bg-accent-400 text-text-main border-2 border-text-main py-4 rounded-2xl font-black uppercase tracking-widest shadow-[4px_4px_0_0_var(--color-text-main)] hover:translate-y-1 hover:shadow-none transition-all">
                  Finalizar Compras ({completed})
               </button>
            )}

            {/* Lists by Category */}
            <div className="space-y-6 mt-4">
               {categories.map(cat => (
                  <div key={cat} className="space-y-3">
                     <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-2">{cat}</h3>
                     <div className="space-y-3">
                        {items.filter(i => i.category === cat).map(item => (
                           <div
                              key={item.id}
                              onClick={() => toggleItem(item)}
                              className={`w-full flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all cursor-pointer text-left ${item.checked ? 'bg-slate-100 border-border-subtle' : 'bg-surface border-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1'}`}
                           >
                              <div className={item.checked ? 'text-primary-700' : 'text-border-subtle'}>
                                 {item.checked ? <CheckCircle2 size={24} className="fill-primary-700 text-surface" /> : <Circle size={24} className="text-text-secondary" />}
                              </div>
                              {item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                 <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain drop-shadow-sm scale-[1.8] transform-gpu origin-center shrink-0 mx-2" />
                              ) : (
                                 <span className="text-2xl opacity-90">{item.icon}</span>
                              )}
                              <div className="flex-1">
                                 <p className={`font-bold text-sm ${item.checked ? 'line-through decoration-text-secondary/50 text-text-secondary' : 'text-text-main'}`}>{item.name}</p>
                                 <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{item.qty}</p>
                              </div>
                              <button onClick={(e) => handleDelete(e, item.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-background border-2 border-border-subtle text-text-secondary hover:text-red-500 hover:border-red-500 transition-colors">
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
               {total === 0 && (
                  <div className="text-center p-10 bg-surface border-2 border-dashed border-text-main rounded-[32px]">
                     <p className="text-text-secondary font-bold text-sm">Tu lista de compras está vacía.</p>
                  </div>
               )}
            </div>

            {/* FAB */}
            <div className="fixed bottom-32 left-0 right-0 flex justify-center pointer-events-none px-6 z-[60]">
               <button onClick={handleOpenModal} className="pointer-events-auto bg-primary-900 text-surface px-8 py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1">
                  <Plus size={18} /> Agregar Producto
               </button>
            </div>
         </>
      ) : (
         <div className="space-y-6 animate-in fade-in">
            {Object.entries(historyGroups).sort((a,b) => Number(b[0]) - Number(a[0])).map(([year, months]) => (
               <div key={year} className="bg-surface border-2 border-text-main rounded-[32px] overflow-hidden shadow-[8px_8px_0_0_var(--color-text-main)]">
                  <div className="p-6 border-b-2 border-text-main bg-orange-500 flex justify-between items-center">
                     <h3 className="text-2xl font-black text-surface tracking-widest">{year}</h3>
                  </div>
                  <div className="p-4 space-y-4">
                     {Object.entries(months).map(([month, logs]) => (
                        <div key={month} className="space-y-4">
                           <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-2">{month}</h4>
                           <div className="space-y-3">
                              {logs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => {
                                 const d = new Date(log.date);
                                 return (
                                    <div key={log.id} className="bg-surface border-2 border-text-main rounded-[24px] p-5 shadow-[4px_4px_0_0_var(--color-text-main)]">
                                       <div className="flex gap-3 items-center mb-4 border-b-2 border-border-subtle pb-3">
                                          <div className="w-4 h-4 rounded-full bg-accent-400 border-2 border-text-main"></div>
                                          <span className="text-xs font-black uppercase tracking-widest text-text-secondary">
                                             {d.getDate()} {month.substring(0,3)}
                                          </span>
                                          <span className="text-[9px] font-bold bg-background px-2 py-1 rounded-full border border-border-subtle text-text-secondary">
                                             {d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                          </span>
                                       </div>
                                       <div className="flex flex-wrap gap-2">
                                          {log.items.map(item => (
                                             <div key={item.id} className="flex items-center gap-2 bg-background border-2 border-border-subtle px-3 py-1.5 rounded-xl">
                                                {item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                                <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain drop-shadow-sm scale-[1.8] transform-gpu origin-center shrink-0 mb-1 mx-2" />
                                             ) : (
                                                <span className="text-lg">{item.icon}</span>
                                             )}
                                                <span className="font-bold text-xs text-text-main">{item.name}</span>
                                                <span className="text-[10px] font-bold text-text-secondary">{item.qty}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ))}
            {Object.keys(historyGroups).length === 0 && (
               <div className="text-center p-10 bg-surface border-2 border-dashed border-text-main rounded-[32px]">
                  <p className="text-text-secondary font-bold text-sm">No hay compras registradas aún.</p>
               </div>
            )}
         </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
         <div className="fixed inset-0 bg-text-main/20  z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
            <div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md neo-card shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)] relative">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display font-black text-text-main uppercase tracking-tight">Agregar a Lista</h3>
                  <button onClick={() => setShowAddModal(false)} className="w-8 h-8 bg-background border-2 border-border-subtle rounded-full flex items-center justify-center text-text-secondary hover:text-text-main hover:border-text-main">
                     <X size={16} />
                  </button>
               </div>
               
               {addMode === 'inventory' ? (
                  <div className="space-y-4">
                     <div className="mb-2">
                        <input type="text" placeholder="Buscar en tu inventario..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[4px_4px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                     </div>
                     <div className="max-h-[40vh] overflow-y-auto p-1 custom-scrollbar">
                        {Array.from(new Set((inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(i => i.category))).map(cat => (
                           <div key={cat} className="mb-4">
                              <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">{cat}</h4>
                              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                 {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) && i.category === cat).map(item => (
                                    <button key={item.id} onClick={() => {
                                       setAddName(item.name);
                                       setAddCat(CATEGORIES.find(c => c.toUpperCase().includes(item.category.split(',')[0].toUpperCase())) || CATEGORIES[6]);
                                       setAddIcon(item.icon);
                                       setAddAmount(item.lowThreshold || 1);
                                       setAddUnit(item.unit || 'pz');
                                       setAddMode('custom');
                                    }} className="bg-surface border-2 border-text-main rounded-[20px] p-3 flex flex-col items-center justify-center text-center hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:shadow-[6px_6px_0_0_var(--color-text-main)] transition-all neo-card">
                                       {item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                       <img src={item.icon} alt={item.name} className="w-10 h-10 object-contain mb-2 drop-shadow-md scale-[2.2] transform-gpu origin-center" />
                                    ) : (
                                       <span className="text-3xl mb-2">{item.icon}</span>
                                    )}
                                       <p className="font-bold text-[9px] sm:text-[10px] text-text-main leading-tight line-clamp-2">{item.name}</p>
                                    </button>
                                 ))}
                              </div>
                           </div>
                        ))}
                        {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                           <p className="text-center text-text-secondary font-bold text-xs py-6">No se encontraron alimentos.</p>
                        )}
                     </div>
                     <div className="pt-4 border-t-2 border-border-subtle">
                        <button onClick={() => { setAddMode('custom'); if (addIcon === '🛒') setAddIcon({'Frutas y Verduras':'🍎','Carnes, Aves y Pescados':'🥩','Lácteos y Huevo':'🥛','Panadería y Cereales':'🍞','Abarrotes y Despensa':'🥫','Bebidas e Infusiones':'🧃','Otros':'🛒'}[addCat] || '🛒'); }} className="w-full bg-orange-500 border-2 border-text-main text-surface font-black uppercase tracking-widest py-4 rounded-xl hover:-translate-y-1 transition-all shadow-[4px_4px_0_0_var(--color-text-main)] neo-btn">
                           Agregar Manual
                        </button>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {inventory && inventory.length > 0 && (
                        <button onClick={() => setAddMode('inventory')} className="text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-main mb-2 block neo-btn px-3 py-2 border-2 border-text-main rounded-lg shadow-[2px_2px_0_0_var(--color-text-main)]">
                           ← Volver al Inventario
                        </button>
                     )}
                     <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-1">
                           <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Icono</label>
                           <input type="text" value={addIcon} onChange={e => setAddIcon(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-center text-2xl focus:outline-none focus:border-primary-500 shadow-[4px_4px_0_0_var(--color-text-main)]" />
                        </div>
                        <div className="col-span-3">
                           <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Nombre</label>
                           <input type="text" placeholder="Ej: Manzanas" value={addName} onChange={e => setAddName(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500 shadow-[4px_4px_0_0_var(--color-text-main)]" />
                        </div>
                     </div>
                     
                     <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Categoría</label>
                        <select value={addCat} onChange={e => {
                           const newCat = e.target.value;
                           setAddCat(newCat);
                           const catIconMap: Record<string, string> = {
                              'Frutas y Verduras': '/frutasyverduras.png',
                              'Carnes, Aves y Pescados': '/carnes.png',
                              'Lácteos y Huevo': '/lacteos.png',
                              'Panadería y Cereales': '/panaderia-1.png',
                              'Abarrotes y Despensa': '/abarrotes.png',
                              'Bebidas e Infusiones': '/te.png',
                              'Otros': '🛒'
                           };
                           if (addIcon === '🛒' || addIcon === catIconMap[addCat]) {
                              setAddIcon(catIconMap[newCat] || '🛒');
                           }
                        }} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500 shadow-[4px_4px_0_0_var(--color-text-main)]">
                           {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Cantidad</label>
                           <NumberStepper value={addAmount} onChange={setAddAmount} />
                        </div>
                        <div>
                           <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Unidad</label>
                           <input type="text" placeholder="Ej: piezas" value={addUnit} onChange={e => setAddUnit(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500 shadow-[4px_4px_0_0_var(--color-text-main)]" />
                        </div>
                     </div>
                     
                     <div className="pt-4">
                        <button onClick={handleSaveNew} className="w-full bg-orange-500 border-2 border-text-main text-surface font-black uppercase tracking-widest py-4 rounded-xl neo-btn hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)]">
                           Agregar Producto
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      )}
    </div>
  );
}

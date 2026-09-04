const fs = require('fs');

const code = `import React, { useState } from 'react';
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

export default function ShoppingView() {
  const { shoppingList, addShoppingItem, updateShoppingItem, deleteShoppingItem, shoppingHistory, saveShoppingHistory } = useAppData();
  
  const [view, setView] = useState<'list'|'history'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addQty, setAddQty] = useState('');
  const [addCat, setAddCat] = useState(CATEGORIES[0]);
  const [addIcon, setAddIcon] = useState('🛒');

  const items = shoppingList || [];
  
  const toggleItem = (item: ShoppingItem) => {
    updateShoppingItem(item.id, { checked: !item.checked });
  };
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
     e.stopPropagation();
     deleteShoppingItem(id);
  };
  
  const handleSaveNew = () => {
     if (!addName) return;
     addShoppingItem({
        name: addName,
        qty: addQty || '1',
        category: addCat.toUpperCase(),
        icon: addIcon,
        checked: false
     });
     setShowAddModal(false);
     setAddName('');
     setAddQty('');
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
            <h1 className="text-3xl md:text-4xl font-display font-black text-text-main tracking-tight uppercase">Compras</h1>
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
                  <div className="h-full bg-accent-500 rounded-full transition-all duration-500" style={{ width: \`\${progress}%\` }}></div>
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
                              className={\`w-full flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all cursor-pointer text-left \${item.checked ? 'bg-slate-100 border-border-subtle' : 'bg-surface border-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1'}\`}
                           >
                              <div className={item.checked ? 'text-primary-700' : 'text-border-subtle'}>
                                 {item.checked ? <CheckCircle2 size={24} className="fill-primary-700 text-surface" /> : <Circle size={24} className="text-text-secondary" />}
                              </div>
                              <span className="text-2xl opacity-90">{item.icon}</span>
                              <div className="flex-1">
                                 <p className={\`font-bold text-sm \${item.checked ? 'line-through decoration-text-secondary/50 text-text-secondary' : 'text-text-main'}\`}>{item.name}</p>
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
                  <div className="text-center p-10 border-2 border-dashed border-border-subtle rounded-[32px]">
                     <p className="text-text-secondary font-bold text-sm">Tu lista de compras está vacía.</p>
                  </div>
               )}
            </div>

            {/* FAB */}
            <div className="fixed bottom-32 left-0 right-0 flex justify-center pointer-events-none px-6 z-[60]">
               <button onClick={() => setShowAddModal(true)} className="pointer-events-auto bg-primary-900 text-surface px-8 py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1">
                  <Plus size={18} /> Agregar Producto
               </button>
            </div>
         </>
      ) : (
         <div className="space-y-6 animate-in fade-in">
            {Object.entries(historyGroups).sort((a,b) => Number(b[0]) - Number(a[0])).map(([year, months]) => (
               <div key={year} className="bg-[#f4f7db] border-2 border-text-main rounded-[32px] overflow-hidden shadow-[8px_8px_0_0_var(--color-text-main)]">
                  <div className="p-6 border-b-2 border-text-main bg-[#eef1cc] flex justify-between items-center">
                     <h3 className="text-2xl font-black text-text-main tracking-widest">{year}</h3>
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
                                                <span className="text-lg">{item.icon}</span>
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
               <div className="text-center p-10 border-2 border-dashed border-border-subtle rounded-[32px]">
                  <p className="text-text-secondary font-bold text-sm">No hay compras registradas aún.</p>
               </div>
            )}
         </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
         <div className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
            <div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md neo-card shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)] relative">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display font-black text-text-main uppercase tracking-tight">Agregar a Lista</h3>
                  <button onClick={() => setShowAddModal(false)} className="w-8 h-8 bg-background border-2 border-border-subtle rounded-full flex items-center justify-center text-text-secondary hover:text-text-main hover:border-text-main">
                     <X size={16} />
                  </button>
               </div>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                     <div className="col-span-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Icono</label>
                        <input type="text" value={addIcon} onChange={e => setAddIcon(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-center text-2xl focus:outline-none focus:border-primary-500" />
                     </div>
                     <div className="col-span-3">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Nombre</label>
                        <input type="text" placeholder="Ej: Manzanas" value={addName} onChange={e => setAddName(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500" />
                     </div>
                  </div>
                  
                  <div>
                     <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Categoría</label>
                     <select value={addCat} onChange={e => setAddCat(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
                  
                  <div>
                     <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Cantidad / Unidad</label>
                     <input type="text" placeholder="Ej: 2 kg, 3 piezas" value={addQty} onChange={e => setAddQty(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500" />
                  </div>
                  
                  <div className="pt-4">
                     <button onClick={handleSaveNew} className="w-full bg-primary-900 border-2 border-text-main text-surface font-black uppercase tracking-widest py-4 rounded-xl neo-btn hover:bg-primary-800 shadow-[4px_4px_0_0_var(--color-text-main)]">
                        Agregar Producto
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/ShoppingView.tsx', code, 'utf-8');

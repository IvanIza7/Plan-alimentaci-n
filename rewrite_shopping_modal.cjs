const fs = require('fs');
let code = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');

code = code.replace(
  /const { shoppingList, addShoppingItem, updateShoppingItem, deleteShoppingItem, shoppingHistory, saveShoppingHistory } = useAppData\(\);/,
  "const { shoppingList, addShoppingItem, updateShoppingItem, deleteShoppingItem, shoppingHistory, saveShoppingHistory, inventory } = useAppData();"
);

code = code.replace(
  /const \[addIcon, setAddIcon\] = useState\('🛒'\);/,
  `const [addIcon, setAddIcon] = useState('🛒');
  const [addMode, setAddMode] = useState<'inventory'|'custom'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');`
);

code = code.replace(
  /const handleSaveNew = \(\) => \{/,
  `const handleOpenModal = () => {
     setShowAddModal(true);
     setAddMode('inventory');
     setSearchTerm('');
  };

  const handleSaveNew = () => {`
);

code = code.replace(
  /onClick=\{\(\) => setShowAddModal\(true\)\}/,
  `onClick={handleOpenModal}`
);

const oldModalContent = `<div className="space-y-4">
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
               </div>`;

const newModalContent = `{addMode === 'inventory' ? (
                  <div className="space-y-4">
                     <div className="mb-2">
                        <input type="text" placeholder="Buscar en tu inventario..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500" />
                     </div>
                     <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                           <button key={item.id} onClick={() => {
                              setAddName(item.name);
                              setAddCat(CATEGORIES.find(c => c.toUpperCase().includes(item.category.split(',')[0].toUpperCase())) || CATEGORIES[6]);
                              setAddIcon(item.icon);
                              setAddQty(\`\${item.lowThreshold || 1} \${item.unit}\`);
                              setAddMode('custom');
                           }} className="w-full flex items-center gap-3 p-3 bg-surface border-2 border-border-subtle rounded-xl hover:border-text-main transition-colors text-left group">
                              <span className="text-2xl">{item.icon}</span>
                              <div className="flex-1">
                                 <p className="font-bold text-text-main text-sm">{item.name}</p>
                                 <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">{item.category}</p>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-background border-2 border-border-subtle flex items-center justify-center group-hover:bg-primary-100 group-hover:border-primary-500 group-hover:text-primary-600 transition-colors">
                                 <Plus size={14} />
                              </div>
                           </button>
                        ))}
                        {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                           <p className="text-center text-text-secondary font-bold text-xs py-6">No se encontraron alimentos en tu inventario.</p>
                        )}
                     </div>
                     <div className="pt-4 border-t-2 border-border-subtle">
                        <button onClick={() => setAddMode('custom')} className="w-full bg-background border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-[2px_2px_0_0_var(--color-text-main)]">
                           Agregar Producto Manual
                        </button>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {inventory && inventory.length > 0 && (
                        <button onClick={() => setAddMode('inventory')} className="text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-main mb-2 block">
                           ← Volver al Inventario
                        </button>
                     )}
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
               )}`;

code = code.replace(oldModalContent, newModalContent);

fs.writeFileSync('src/components/ShoppingView.tsx', code, 'utf-8');

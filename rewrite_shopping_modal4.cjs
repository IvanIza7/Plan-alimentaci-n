const fs = require('fs');
let code = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');

// The replacement logic:
// State needs to keep track of expanded category:
// const [expandedCat, setExpandedCat] = useState<string | null>(null);

const catIconMap = {
  'Frutas y Verduras': '🍎',
  'Carnes, Aves y Pescados': '🥩',
  'Lácteos y Huevo': '🥛',
  'Panadería y Cereales': '🍞',
  'Abarrotes y Despensa': '🥫',
  'Bebidas e Infusiones': '🧃',
  'Otros': '🛒'
};

// First, insert expandedCat state
code = code.replace(
  "const [addMode, setAddMode] = useState<'inventory'|'custom'>('inventory');",
  "const [addMode, setAddMode] = useState<'inventory'|'custom'>('inventory');\n  const [expandedCat, setExpandedCat] = useState<string | null>(null);"
);

// We need an auto-assign icon logic when selecting category in custom mode.
code = code.replace(
  /<select value=\{addCat\} onChange=\{e => setAddCat\(e.target.value\)\}/g,
  `<select value={addCat} onChange={e => {
                           const newCat = e.target.value;
                           setAddCat(newCat);
                           const catIconMap: Record<string, string> = {
                              'Frutas y Verduras': '🍎',
                              'Carnes, Aves y Pescados': '🥩',
                              'Lácteos y Huevo': '🥛',
                              'Panadería y Cereales': '🍞',
                              'Abarrotes y Despensa': '🥫',
                              'Bebidas e Infusiones': '🧃',
                              'Otros': '🛒'
                           };
                           if (addIcon === '🛒' || addIcon === catIconMap[addCat]) {
                              setAddIcon(catIconMap[newCat] || '🛒');
                           }
                        }}`
);

// We need the same logic when opening manual add mode:
code = code.replace(
  "setAddMode('custom')",
  "setAddMode('custom'); if (addIcon === '🛒') setAddIcon(addCat ? {'Frutas y Verduras':'🍎','Carnes, Aves y Pescados':'🥩','Lácteos y Huevo':'🥛','Panadería y Cereales':'🍞','Abarrotes y Despensa':'🥫','Bebidas e Infusiones':'🧃','Otros':'🛒'}[addCat] || '🛒' : '🛒');"
);


// Replace the entire inventory rendering logic
const oldInventoryStr = `                     <div className="max-h-[40vh] overflow-y-auto p-1 custom-scrollbar">
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
                                       <span className="text-3xl mb-2">{item.icon}</span>
                                       <p className="font-bold text-[9px] sm:text-[10px] text-text-main leading-tight line-clamp-2">{item.name}</p>
                                    </button>
                                 ))}
                              </div>
                           </div>
                        ))}
                        {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                           <p className="text-center text-text-secondary font-bold text-xs py-6">No se encontraron alimentos.</p>
                        )}
                     </div>`;

const newInventoryStr = `                     <div className="max-h-[50vh] overflow-y-auto p-1 custom-scrollbar">
                        {searchTerm ? (
                           <div className="grid grid-cols-3 gap-2 sm:gap-3">
                              {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                                 <button key={item.id} onClick={() => {
                                    setAddName(item.name);
                                    setAddCat(CATEGORIES.find(c => c.toUpperCase().includes(item.category.split(',')[0].toUpperCase())) || CATEGORIES[6]);
                                    setAddIcon(item.icon);
                                    setAddAmount(item.lowThreshold || 1);
                                    setAddUnit(item.unit || 'pz');
                                    setAddMode('custom');
                                 }} className="bg-surface border-2 border-text-main rounded-[20px] p-3 flex flex-col items-center justify-center text-center hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:shadow-[6px_6px_0_0_var(--color-text-main)] transition-all neo-card">
                                    <span className="text-3xl mb-2">{item.icon}</span>
                                    <p className="font-bold text-[9px] sm:text-[10px] text-text-main leading-tight line-clamp-2">{item.name}</p>
                                 </button>
                              ))}
                              {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                 <div className="col-span-3 text-center text-text-secondary font-bold text-xs py-6">No se encontraron alimentos.</div>
                              )}
                           </div>
                        ) : (
                           <div className="space-y-3">
                              {CATEGORIES.map(cat => {
                                 const catItems = (inventory || []).filter(i => i.category.split(',')[0].trim().toUpperCase() === cat.toUpperCase());
                                 if (catItems.length === 0) return null;
                                 const isExpanded = expandedCat === cat;
                                 const catIconMap: Record<string, string> = {
                                    'Frutas y Verduras': '🍎',
                                    'Carnes, Aves y Pescados': '🥩',
                                    'Lácteos y Huevo': '🥛',
                                    'Panadería y Cereales': '🍞',
                                    'Abarrotes y Despensa': '🥫',
                                    'Bebidas e Infusiones': '🧃',
                                    'Otros': '🛒'
                                 };
                                 
                                 return (
                                    <div key={cat} className="bg-surface border-2 border-text-main rounded-[24px] overflow-hidden neo-card shadow-[4px_4px_0_0_var(--color-text-main)]">
                                       <button onClick={() => setExpandedCat(isExpanded ? null : cat)} className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left">
                                          <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-text-main flex items-center justify-center text-xl shrink-0 shadow-[2px_2px_0_0_var(--color-text-main)]">
                                             {catIconMap[cat] || '🛒'}
                                          </div>
                                          <div className="flex-1">
                                             <h4 className="text-sm font-black text-text-main tracking-tight uppercase">{cat}</h4>
                                             <p className="text-[9px] font-bold text-text-secondary">{catItems.length} alimentos</p>
                                          </div>
                                       </button>
                                       {isExpanded && (
                                          <div className="p-4 bg-[#f4f7db] border-t-2 border-text-main animate-in slide-in-from-top-2 fade-in duration-200">
                                             <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                                {catItems.map(item => (
                                                   <button key={item.id} onClick={() => {
                                                      setAddName(item.name);
                                                      setAddCat(cat);
                                                      setAddIcon(item.icon);
                                                      setAddAmount(item.lowThreshold || 1);
                                                      setAddUnit(item.unit || 'pz');
                                                      setAddMode('custom');
                                                   }} className="bg-surface border-2 border-text-main rounded-[16px] p-3 flex flex-col items-center justify-center text-center hover:-translate-y-1 shadow-[2px_2px_0_0_var(--color-text-main)] transition-all">
                                                      <span className="text-2xl mb-1">{item.icon}</span>
                                                      <p className="font-bold text-[9px] text-text-main leading-tight line-clamp-2">{item.name}</p>
                                                   </button>
                                                ))}
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                 );
                              })}
                           </div>
                        )}
                     </div>`;

code = code.replace(oldInventoryStr, newInventoryStr);
fs.writeFileSync('src/components/ShoppingView.tsx', code, 'utf-8');

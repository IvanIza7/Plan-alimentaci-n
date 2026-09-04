const fs = require('fs');
let code = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');

// Insert NumberStepper
const stepperComponent = `
const NumberStepper = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
   return (
      <div className="flex items-center justify-between bg-surface border-2 border-text-main rounded-xl overflow-hidden shadow-[4px_4px_0_0_var(--color-text-main)] w-full">
         <button onClick={() => onChange(Math.max(1, value - 1))} className="w-12 h-12 flex items-center justify-center bg-primary-100 hover:bg-primary-200 border-r-2 border-text-main text-xl font-black transition-colors">-</button>
         <div className="flex-1 text-center font-black text-xl">{value}</div>
         <button onClick={() => onChange(value + 1)} className="w-12 h-12 flex items-center justify-center bg-primary-100 hover:bg-primary-200 border-l-2 border-text-main text-xl font-black transition-colors">+</button>
      </div>
   );
};

export default function ShoppingView() {`;
code = code.replace("export default function ShoppingView() {", stepperComponent);

// Replace state
code = code.replace(
  "const [addQty, setAddQty] = useState('');",
  "const [addAmount, setAddAmount] = useState(1);\n  const [addUnit, setAddUnit] = useState('piezas');"
);

// Update save logic
code = code.replace(
  "qty: addQty || '1',",
  "qty: `${addAmount} ${addUnit}`,"
);

// Add reset logic for addAmount/addUnit
code = code.replace(
  "setAddQty('');\n     setAddIcon('🛒');",
  "setAddAmount(1);\n     setAddUnit('piezas');\n     setAddIcon('🛒');"
);

// We need to replace the entire modal content
const modalMatchRegex = /\{addMode === 'inventory' \? \([\s\S]*?Agregar Producto\n\s*<\/button>\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/;

const newModalContent = `{addMode === 'inventory' ? (
                  <div className="space-y-4">
                     <div className="mb-2">
                        <input type="text" placeholder="Buscar en tu inventario..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[4px_4px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                     </div>
                     <div className="max-h-[40vh] overflow-y-auto p-1 custom-scrollbar">
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
                        </div>
                        {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                           <p className="text-center text-text-secondary font-bold text-xs py-6">No se encontraron alimentos.</p>
                        )}
                     </div>
                     <div className="pt-4 border-t-2 border-border-subtle">
                        <button onClick={() => setAddMode('custom')} className="w-full bg-[#fde047] border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-xl hover:-translate-y-1 transition-all shadow-[4px_4px_0_0_var(--color-text-main)] neo-btn">
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
                        <select value={addCat} onChange={e => setAddCat(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500 shadow-[4px_4px_0_0_var(--color-text-main)]">
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
                        <button onClick={handleSaveNew} className="w-full bg-[#4ade80] border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-xl neo-btn hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)]">
                           Agregar Producto
                        </button>
                     </div>
                  </div>
               )}`;

code = code.replace(modalMatchRegex, newModalContent);

fs.writeFileSync('src/components/ShoppingView.tsx', code, 'utf-8');

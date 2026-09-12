import React, { useState } from 'react';
import { Search, Filter, Plus, X, ShoppingCart } from 'lucide-react';
import { useAppData, InventoryItem } from '../hooks/useAppData';

const getCategoryIcon = (cat: string) => {
  if (cat.includes('Frutas')) return '/frutasyverduras.png';
  if (cat.includes('Carnes')) return '/carnes.png';
  if (cat.includes('Lácteos')) return '/lacteos.png';
  if (cat.includes('Panadería')) return '/panaderia-1.png';
  if (cat.includes('Abarrotes')) return '/abarrotes.png';
  if (cat.includes('Bebidas')) return '/te.png';
  return '🛒';
};

const getDefaultUnit = (cat: string) => {
  if (cat.includes('Carnes')) return 'g';
  if (cat.includes('Lácteos')) return 'piezas';
  if (cat.includes('Bebidas')) return 'cajas';
  return 'piezas';
};

const CATEGORIES = [
   'Frutas y Verduras',
   'Carnes, Aves y Pescados',
   'Lácteos y Huevo',
   'Panadería y Cereales',
   'Abarrotes y Despensa',
   'Bebidas e Infusiones'
];

const NumberStepper = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
   return (
      <div className="flex items-center gap-4 bg-background border-2 border-border-subtle rounded-full p-2 w-full max-w-[200px] mx-auto">
         <button onClick={() => onChange(Math.max(0, value - 1))} className="w-10 h-10 flex items-center justify-center bg-surface border-2 border-text-main rounded-full text-text-main hover:bg-slate-50 transition-colors">
            <span className="font-bold text-xl">-</span>
         </button>
         <span className="font-black text-xl flex-1 text-center">{value}</span>
         <button onClick={() => onChange(value + 1)} className="w-10 h-10 flex items-center justify-center bg-text-main border-2 border-text-main rounded-full text-surface hover:bg-gray-800 transition-colors">
            <span className="font-bold text-xl">+</span>
         </button>
      </div>
   );
};

export default function InventoryView() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, addShoppingItem, loading } = useAppData();
  
  const totalItems = inventory.length;
  
  const getStatus = (item: InventoryItem) => item.amount === 0 ? 'missing' : item.amount <= item.lowThreshold ? 'partial' : 'available';
  
  const sufficient = inventory.filter(i => getStatus(i) === 'available').length;
  const partial = inventory.filter(i => getStatus(i) === 'partial').length;
  const missing = inventory.filter(i => getStatus(i) === 'missing').length;

  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Quick Edit State
  const [quickAmount, setQuickAmount] = useState(0);
  const [quickThreshold, setQuickThreshold] = useState(0);
  const [quickKcal, setQuickKcal] = useState(0);

  // Modal state
  const [addCat, setAddCat] = useState(CATEGORIES[0]);
  const [addName, setAddName] = useState('');
  const [addAmount, setAddAmount] = useState<number | ''>('');
  const [addUnit, setAddUnit] = useState(getDefaultUnit(CATEGORIES[0]));
  const [addThreshold, setAddThreshold] = useState<number | ''>('');
  const [addKcal, setAddKcal] = useState<number | ''>('');
  const [addIcon, setAddIcon] = useState('🛒');

  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [shoppingTargetItem, setShoppingTargetItem] = useState<InventoryItem | null>(null);
  const [shoppingName, setShoppingName] = useState('');
  const [shoppingCat, setShoppingCat] = useState(CATEGORIES[0]);
  const [shoppingAmount, setShoppingAmount] = useState<number | ''>('');
  const [shoppingUnit, setShoppingUnit] = useState('pz');
  const [shoppingIcon, setShoppingIcon] = useState('🛒');
  
  const toggleExpandAll = () => {
    if (expandedCats.length === CATEGORIES.length) {
      setExpandedCats([]);
    } else {
      setExpandedCats(CATEGORIES);
    }
  };

  const toggleCat = (cat: string) => {
    if (expandedCats.includes(cat)) {
      setExpandedCats(expandedCats.filter(c => c !== cat));
    } else {
      setExpandedCats([...expandedCats, cat]);
    }
  };
  
  const resetForm = () => {
     setAddName('');
     setAddAmount('');
     setAddThreshold('');
     setAddKcal('');
     setAddIcon('🛒');
     setAddCat(CATEGORIES[0]);
     setAddUnit(getDefaultUnit(CATEGORIES[0]));
  };
  
  const handleSaveNew = async () => {
     if (!addName) return;
     
     const itemData = {
        name: addName,
        category: addCat,
        amount: Number(addAmount) || 0,
        unit: addUnit,
        lowThreshold: Number(addThreshold) || 0,
        kcal: Number(addKcal) || 0,
        icon: addIcon
     };
     
     await addInventoryItem(itemData);
     setShowAddModal(false);
     resetForm();
  };

  const handleUpdateAmount = async () => {
     if (selectedItem) {
        await updateInventoryItem(selectedItem.id, { amount: quickAmount, lowThreshold: quickThreshold, kcal: quickKcal });
        setSelectedItem(null);
     }
  };
  
  const openShoppingModal = (item: InventoryItem) => {
     setShoppingTargetItem(item);
     setShoppingName(item.name);
     setShoppingCat(CATEGORIES.find(c => c.toUpperCase().includes(item.category.split(',')[0].toUpperCase())) || CATEGORIES[0]);
     setShoppingAmount(item.lowThreshold || 1);
     setShoppingUnit(item.unit || 'pz');
     setShoppingIcon(item.icon);
     setShowShoppingModal(true);
  };

  const handleConfirmShopping = () => {
     addShoppingItem({
        name: shoppingName,
        qty: `${shoppingAmount} ${shoppingUnit}`,
        category: shoppingCat.split(',')[0].toUpperCase(),
        icon: shoppingIcon,
        checked: false
     });
     setShowShoppingModal(false);
     setShoppingTargetItem(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-32">
      <header className="pt-2">
         <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-1">Mi Despensa</p>
         <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight uppercase">Inventario</h1>
            <div className="flex gap-2">
               <button className="w-10 h-10 rounded-full border-2 border-text-main flex items-center justify-center bg-surface neo-btn">
                  <Search size={18} />
               </button>
               <button className="w-10 h-10 rounded-full border-2 border-text-main flex items-center justify-center bg-surface neo-btn">
                  <Filter size={18} />
               </button>
            </div>
         </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-2">
         <div className="bg-surface border-2 border-text-main rounded-[20px] p-3 flex flex-col items-center justify-center neo-card shadow-[3px_3px_0_0_var(--color-text-main)] col-span-1">
            <span className="text-xl sm:text-2xl font-black">{totalItems}</span>
            <span className="text-[8px] sm:text-[9px] font-bold text-text-secondary uppercase tracking-widest text-center leading-tight mt-1">Total<br/>Art.</span>
         </div>
         <div className="bg-[#4ade80] border-2 border-text-main text-text-main rounded-[20px] p-3 flex flex-col items-center justify-center neo-card shadow-[3px_3px_0_0_var(--color-text-main)]">
            <span className="text-xl sm:text-2xl font-black">{sufficient}</span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mt-1">Bien</span>
         </div>
         <div className="bg-[#fde047] border-2 border-text-main text-text-main rounded-[20px] p-3 flex flex-col items-center justify-center neo-card shadow-[3px_3px_0_0_var(--color-text-main)]">
            <span className="text-xl sm:text-2xl font-black">{partial}</span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mt-1">Poco</span>
         </div>
         <div className="bg-[#ef4444] border-2 border-text-main text-text-main rounded-[20px] p-3 flex flex-col items-center justify-center neo-card shadow-[3px_3px_0_0_var(--color-text-main)]">
            <span className="text-xl sm:text-2xl font-black">{missing}</span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mt-1">Falta</span>
         </div>
      </div>
      
      {/* Categories List */}
      <div className="flex justify-end">
         <button onClick={toggleExpandAll} className="text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-main">
            {expandedCats.length === CATEGORIES.length ? 'Contraer Todos' : 'Expandir Todos'}
         </button>
      </div>

      <div className="space-y-4">
         {CATEGORIES.map((cat) => {
            const isExpanded = expandedCats.includes(cat);
            const catItems = inventory.filter(i => i.category === cat);
            
            return (
               <div key={cat} className="bg-[#bef264] rounded-[32px] border-2 border-text-main overflow-hidden shadow-[8px_8px_0_0_var(--color-text-main)] mb-6">
                  <button onClick={() => toggleCat(cat)} className="w-full p-5 flex justify-between items-center bg-[#a3e635] border-b-2 border-text-main hover:bg-[#84cc16] transition-colors">
                     <div className="flex items-center gap-3">
                        {getCategoryIcon(cat).startsWith('/') ? (
                            <img src={getCategoryIcon(cat)} alt={cat} className="w-8 h-8 object-contain drop-shadow-sm scale-[2] transform-gpu origin-center shrink-0 mx-2" />
                         ) : (
                            <span className="text-2xl">{getCategoryIcon(cat)}</span>
                         )}
                        <div className="text-left">
                           <h3 className="font-black text-sm uppercase tracking-widest text-text-main">{cat}</h3>
                           <p className="text-[10px] font-bold text-text-secondary">{catItems.length} alimentos</p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">
                        <Plus size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-45 text-red-500' : 'text-text-main'}`} />
                     </div>
                  </button>
                  {isExpanded && (
                     <div className="p-5 bg-[#bef264] transition-all duration-300 ease-in-out">
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                           {catItems.map(item => (
                              <div key={item.id} onClick={() => { setSelectedItem(item); setQuickAmount(item.amount); setQuickThreshold(item.lowThreshold || 0); setQuickKcal(item.kcal || 0); }} className="bg-surface border-2 border-text-main rounded-[24px] p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--color-text-main)] transition-all relative">
                                 {getStatus(item) !== 'available' && (
                                    <div className="absolute -top-2 -right-2">
                                       <button onClick={(e) => { e.stopPropagation(); openShoppingModal(item); }} className="w-8 h-8 bg-primary-500 text-surface rounded-full flex items-center justify-center border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-primary-600 transition-colors z-10" title="Agregar a compras">
                                          <ShoppingCart size={14} />
                                       </button>
                                    </div>
                                 )}
                                 {item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                    <img src={item.icon} alt={item.name} className="w-12 h-12 object-contain mb-3 mt-2 drop-shadow-md scale-[2.2] transform-gpu origin-center" />
                                 ) : (
                                    <span className="text-4xl mb-3 mt-2">{item.icon}</span>
                                 )}
                                 <p className="font-bold text-xs text-text-main leading-tight line-clamp-2">{item.name}</p>
                                 <p className="text-[10px] font-black text-text-secondary mt-1">{item.amount} {item.unit}</p>
                                 <div className={`w-2 h-2 rounded-full mt-3 border border-text-main ${getStatus(item) === 'missing' ? 'bg-red-500' : getStatus(item) === 'partial' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                              </div>
                           ))}
                           {catItems.length === 0 && !loading && (
                              <div className="col-span-full py-6 text-center bg-surface border-2 border-dashed border-text-main rounded-[24px]">
                                 <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Sin alimentos en esta categoría</p>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            );
         })}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
         <div className="fixed inset-0 bg-text-main/20  z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
            <div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md neo-card shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)] relative flex flex-col items-center">
               <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 w-10 h-10 bg-[#ef4444] border-2 border-text-main rounded-full flex items-center justify-center text-white shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-red-600 hover:-translate-y-0.5 transition-all neo-btn z-10">
                  <X size={20} strokeWidth={3} />
               </button>
               
               <span className="text-6xl mb-4 mt-2 block">{selectedItem.icon}</span>
               <h3 className="text-2xl font-display font-black text-text-main uppercase tracking-tight text-center">{selectedItem.name}</h3>
               <p className="text-xs font-bold text-text-secondary tracking-widest uppercase mb-6">{selectedItem.category}</p>
               
               <div className="w-full bg-surface border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-[24px] p-4 mb-3">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Cantidad Actual</span>
                     <span className="text-sm font-black text-text-main">{quickAmount} {selectedItem.unit}</span>
                  </div>
                  <NumberStepper value={quickAmount} onChange={setQuickAmount} />
               </div>
               
               <div className="w-full grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-surface border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-[24px] p-4">
                     <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary block mb-2 text-center">Límite Bajo</span>
                     <input type="number" value={quickThreshold} onChange={e => setQuickThreshold(Number(e.target.value))} className="w-full bg-background border-2 border-text-main rounded-xl p-2 font-bold text-center text-sm focus:outline-none" />
                  </div>
                  <div className="bg-surface border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-[24px] p-4">
                     <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary block mb-2 text-center">Kcal</span>
                     <input type="number" value={quickKcal} onChange={e => setQuickKcal(Number(e.target.value))} className="w-full bg-background border-2 border-text-main rounded-xl p-2 font-bold text-center text-sm focus:outline-none" />
                  </div>
               </div>
               
               <div className="w-full flex gap-3">
                  <button onClick={() => { deleteInventoryItem(selectedItem.id); setSelectedItem(null); }} className="w-14 shrink-0 bg-[#fca5a5] text-text-main border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-xl font-black flex items-center justify-center neo-btn hover:-translate-y-1 transition-all">
                     <X size={20} strokeWidth={3} />
                  </button>
                  <button onClick={handleUpdateAmount} className="flex-1 bg-primary-900 border-2 border-text-main text-surface font-black uppercase tracking-widest py-4 rounded-xl neo-btn hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] transition-all">
                     Actualizar
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* FAB - ORIGINAL DESIGN */}
      <div className="fixed bottom-32 left-0 right-0 flex justify-center pointer-events-none px-6 z-[60]">
         <button onClick={() => { resetForm(); setShowAddModal(true); }} className="pointer-events-auto bg-primary-900 text-surface px-8 py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1">
            <Plus size={18} /> Agregar Alimento
         </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
         <div className="fixed inset-0 bg-text-main/20  z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
            <div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md neo-card shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)] max-h-[90vh] overflow-y-auto relative">
               <div className="flex justify-between items-center mb-6 sticky top-0 bg-surface z-10 py-2 border-b-2 border-text-main pb-4">
                  <h3 className="text-xl font-display font-black text-text-main uppercase tracking-tight">Nuevo Alimento</h3>
                  <button onClick={() => setShowAddModal(false)} className="w-10 h-10 bg-[#ef4444] border-2 border-text-main rounded-full flex items-center justify-center text-white shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-red-600 hover:-translate-y-0.5 transition-all neo-btn">
                     <X size={20} strokeWidth={3} />
                  </button>
               </div>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                     <div className="col-span-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Icono</label>
                        <input type="text" placeholder="🍎 o /img.png" value={addIcon} onChange={e => setAddIcon(e.target.value)} className="w-full bg-background border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-xl p-3 font-bold text-center text-sm focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" title="Usa un emoji o la ruta de tu imagen local" />
                     </div>
                     <div className="col-span-3">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Nombre</label>
                        <input type="text" placeholder="Ej: Manzanas" value={addName} onChange={e => setAddName(e.target.value)} className="w-full bg-background border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-xl p-3 font-bold text-sm focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                     </div>
                  </div>
                  
                  <div>
                     <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Categoría</label>
                     <select value={addCat} onChange={e => setAddCat(e.target.value)} className="w-full bg-background border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-xl p-3 font-bold text-sm focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Cantidad Inicial</label>
                        <input type="number" placeholder="0" value={addAmount} onChange={e => setAddAmount(e.target.value ? Number(e.target.value) : '')} className="w-full bg-background border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-xl p-3 font-bold text-sm focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                     </div>
                     <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Unidad</label>
                        <input type="text" placeholder="pz" value={addUnit} onChange={e => setAddUnit(e.target.value)} className="w-full bg-background border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-xl p-3 font-bold text-sm focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                     </div>
                     <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Límite Bajo</label>
                        <input type="number" placeholder="Ej: 2" value={addThreshold} onChange={e => setAddThreshold(e.target.value ? Number(e.target.value) : '')} className="w-full bg-background border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-xl p-3 font-bold text-sm focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" title="Avisar cuando haya menos de esta cantidad" />
                     </div>
                     <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Kcal / {addUnit}</label>
                        <input type="number" placeholder="Ej: 50" value={addKcal} onChange={e => setAddKcal(e.target.value ? Number(e.target.value) : '')} className="w-full bg-background border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] rounded-xl p-3 font-bold text-sm focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                     </div>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                     <button onClick={handleSaveNew} className="flex-1 bg-primary-900 border-2 border-text-main text-surface font-black uppercase tracking-widest py-4 rounded-xl neo-btn hover:bg-primary-800 shadow-[4px_4px_0_0_var(--color-text-main)]">
                        Agregar a Inventario
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Add to Shopping Modal */}
      {showShoppingModal && (
         <div className="fixed inset-0 bg-text-main/20  z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
            <div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md neo-card shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)] relative">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display font-black text-text-main uppercase tracking-tight">Agregar a Lista</h3>
                  <button onClick={() => setShowShoppingModal(false)} className="w-10 h-10 bg-[#ef4444] border-2 border-text-main rounded-full flex items-center justify-center text-white shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-red-600 hover:-translate-y-0.5 transition-all neo-btn">
                     <X size={20} strokeWidth={3} />
                  </button>
               </div>
               
               <div className="space-y-4">
                  <div className="w-full">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Nombre</label>
                        <input type="text" placeholder="Ej: Manzanas" value={shoppingName} onChange={e => setShoppingName(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500 shadow-[4px_4px_0_0_var(--color-text-main)]" />
                  </div>
                  
                  <div>
                     <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Categoría</label>
                     <select value={shoppingCat} onChange={e => {
                        const newCat = e.target.value;
                        setShoppingCat(newCat);
                        const catIconMap: Record<string, string> = {
                           'Frutas y Verduras': '/frutasyverduras.png',
                           'Carnes, Aves y Pescados': '/carnes.png',
                           'Lácteos y Huevo': '/lacteos.png',
                           'Panadería y Cereales': '/panaderia-1.png',
                           'Abarrotes y Despensa': '/abarrotes.png',
                           'Bebidas e Infusiones': '/te.png',
                           'Otros': '🛒'
                        };
                        if (shoppingIcon === '🛒' || shoppingIcon === catIconMap[shoppingCat]) {
                           setShoppingIcon(catIconMap[newCat] || '🛒');
                        }
                     }} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500 shadow-[4px_4px_0_0_var(--color-text-main)]">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Cantidad</label>
                        <NumberStepper value={Number(shoppingAmount)} onChange={setShoppingAmount} />
                     </div>
                     <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Unidad</label>
                        <input type="text" placeholder="Ej: piezas" value={shoppingUnit} onChange={e => setShoppingUnit(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-primary-500 shadow-[4px_4px_0_0_var(--color-text-main)]" />
                     </div>
                  </div>
                  
                  <div className="pt-4">
                     <button onClick={handleConfirmShopping} className="w-full bg-orange-500 border-2 border-text-main text-surface font-black uppercase tracking-widest py-4 rounded-xl neo-btn hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)]">
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

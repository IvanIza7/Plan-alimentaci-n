import React, { useState } from 'react';
import { X, Plus, Trash2, ArrowRight, Edit3, Search, GripVertical } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';

interface MenuEditorProps {
  menu: any;
  onClose: () => void;
  onSave: (updates: any) => void;
  onDelete?: () => void;
}

function formatTo24h(timeStr: string) {
  if (!timeStr) return '12:00';
  if (!timeStr.includes('AM') && !timeStr.includes('PM')) return timeStr.substring(0, 5);
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  if (period === 'PM' && hours !== '12') hours = String(Number(hours) + 12);
  if (period === 'AM' && hours === '12') hours = '00';
  return `${hours.padStart(2, '0')}:${minutes}`;
}

function formatTo12h(timeStr: string) {
  if (!timeStr) return '12:00 PM';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  let [hours, minutes] = timeStr.split(':');
  const h = Number(hours);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:${minutes} ${period}`;
}

export default function MenuEditorModal({ menu, onClose, onSave, onDelete }: MenuEditorProps) {
  const { inventory } = useAppData();
  const [title, setTitle] = useState(menu.title);
  const [coverImage, setCoverImage] = useState(menu.coverImage || '/menu1.jpg');
  const [themeColor, setThemeColor] = useState(menu.themeColor || 'amarillo');
  const [meals, setMeals] = useState<any[]>(menu.meals || []);
  
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  
  const [newMealName, setNewMealName] = useState('');
  const [newMealType, setNewMealType] = useState('COLACIÓN');
  const [newMealTime, setNewMealTime] = useState('12:00 PM');
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [draggedMealIdx, setDraggedMealIdx] = useState<number | null>(null);

  const [itemToAdd, setItemToAdd] = useState<any | null>(null);
  const [itemQty, setItemQty] = useState<number>(1);
  const [isAddingToDish, setIsAddingToDish] = useState<boolean>(false);
  const [dishNameInput, setDishNameInput] = useState<string>('');
  const [dishIngredients, setDishIngredients] = useState<any[]>([]);
  const [editingDishIdx, setEditingDishIdx] = useState<number | null>(null);

  const categories = Array.from(new Set<string>(inventory.map((item: any) => item.category)));
  const groupedInventory = categories.map(cat => ({
    name: cat,
    items: inventory.filter(item => item.category === cat && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  const handleAddIngredient = (item: any) => {
    if (isAddingToDish) {
      if (dishIngredients.find(i => i.name === item.name)) return;
    } else {
      if (selectedIngredients.find(i => i.name === item.name)) return;
    }
    setItemToAdd(item);
    setItemQty(item.unit === 'g' || item.unit === 'ml' ? 100 : 1);
  };

  const handleRemoveIngredient = (name: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.name !== name));
  };
  
  const handleRemoveDishIngredient = (name: string) => {
    setDishIngredients(dishIngredients.filter(i => i.name !== name));
  };

  const openAddMeal = () => {
    setEditingMealId(null);
    setNewMealName('');
    setNewMealType('COLACIÓN');
    setNewMealTime('12:00 PM');
    setSelectedIngredients([]);
    setSelectedDishes([]);
    setShowAddMeal(true);
  };
  
  const openEditMeal = (meal: any) => {
    setEditingMealId(meal.id);
    setNewMealName(meal.name);
    setNewMealType(meal.type);
    setNewMealTime(meal.time);
    setSelectedIngredients(meal.ingredients || []);
    setSelectedDishes(meal.dishes || []);
    setShowAddMeal(true);
  };

  const handleSaveMeal = () => {
    if (!newMealName) return;
    
    let updatedMeals = [];
    if (editingMealId) {
       updatedMeals = meals.map(m => m.id === editingMealId ? {
          ...m,
          name: newMealName,
          type: newMealType,
          time: newMealTime,
          ingredients: selectedIngredients,
          dishes: selectedDishes
       } : m);
    } else {
       const newMeal = {
         id: 'meal-' + Date.now(),
         type: newMealType,
         time: newMealTime,
         name: newMealName,
         status: 'available',
         statusText: 'Disponible',
         icon: '🍽️',
         ingredients: selectedIngredients,
         dishes: selectedDishes
       };
       updatedMeals = [...meals, newMeal];
    }
    
    updatedMeals.sort((a, b) => {
      const parse = (t: string) => {
        if (!t) return 0;
        const [time, p] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (p === 'PM' && h !== 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };
      return parse(a.time) - parse(b.time);
    });
    
    setMeals(updatedMeals);
    
    setShowAddMeal(false);
    setEditingMealId(null);
    setNewMealName('');
    setSelectedIngredients([]);
    setSelectedDishes([]);
  };

  return (
    <div className="fixed inset-0 bg-text-main/20  z-[100] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-surface border-2 border-text-main rounded-[32px] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto neo-card shadow-[8px_8px_0_0_var(--color-text-main)] custom-scrollbar">
        
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-text-main">Editar Menú</h3>
            <button onClick={onClose} className="w-10 h-10 bg-[#ef4444] border-2 border-text-main rounded-full flex items-center justify-center text-white shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-red-600 hover:-translate-y-0.5 transition-all neo-btn shrink-0">
               <X size={20} strokeWidth={3} />
            </button>
          </div>
          
          <div className="mb-6">
             <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Nombre del menú</label>
             <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full bg-background border-2 border-text-main rounded-xl p-4 font-bold text-text-main focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] shadow-[4px_4px_0_0_var(--color-text-main)] transition-all"
             />
          </div>

          <div className="mb-6">
             <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Portada del menú</label>
             <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 custom-scrollbar">
                {["/menu1.jpg", "/menu2.jpg", "/menu3.jpg", "/menu4.jpg", "/menu5.jpg", "/menu6.jpg", "/menu7.jpg"].map(img => (
                   <img 
                      key={img}
                      src={img}
                      alt="Cover option"
                      onClick={() => setCoverImage(img)}
                      className={`w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover cursor-pointer border-2 transition-all shrink-0 ${coverImage === img ? 'border-primary-900 shadow-[4px_4px_0_0_var(--color-primary-900)] scale-110' : 'border-transparent hover:border-text-main'}`}
                   />
                ))}
             </div>
          </div>

          <div className="mb-6">
             <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Color del menú</label>
             <div className="flex gap-4">
                {[
                   { id: 'amarillo', class: 'bg-[#fde047]' },
                   { id: 'azul', class: 'bg-blue-400' },
                   { id: 'verde', class: 'bg-green-400' },
                   { id: 'naranja', class: 'bg-orange-500' }
                ].map(color => (
                   <button
                      key={color.id}
                      onClick={() => setThemeColor(color.id)}
                      className={`w-10 h-10 rounded-full border-2 border-text-main ${color.class} transition-all ${themeColor === color.id ? 'shadow-[4px_4px_0_0_var(--color-text-main)] scale-110' : 'shadow-none hover:shadow-[2px_2px_0_0_var(--color-text-main)]'}`}
                   />
                ))}
             </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Comidas ({meals.length})</h4>
                {!showAddMeal && (
                  <button onClick={openAddMeal} className="text-[10px] font-black uppercase tracking-widest text-text-main bg-[#fde047] px-4 py-2 rounded-xl flex items-center gap-1 border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1 transition-all">
                     <Plus size={14} /> Agregar
                  </button>
                )}
             </div>

             {showAddMeal && (
                <div className="bg-[#bef264] border-2 border-text-main p-5 rounded-[24px] mb-6 shadow-[4px_4px_0_0_var(--color-text-main)] animate-in slide-in-from-top-2 fade-in">
                   <h5 className="text-sm font-black uppercase tracking-widest text-text-main mb-4">{editingMealId ? 'Editar Comida' : 'Nueva Comida'}</h5>
                   <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                         <input type="text" placeholder="Ej: Licuado" value={newMealName} onChange={e => setNewMealName(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                         <select value={newMealType} onChange={e => setNewMealType(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all">
                            <option>DESAYUNO</option>
                            <option>COMIDA</option>
                            <option>CENA</option>
                            <option>COLACIÓN</option>
                         </select>
                         <input type="time" value={formatTo24h(newMealTime)} onChange={e => setNewMealTime(formatTo12h(e.target.value))} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                      </div>
                      
                      <div className="space-y-3">
                         <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Ingredientes del Inventario</p>
                         
                         {selectedDishes.length > 0 && (
                            <div className="flex flex-col gap-3 mb-4">
                               {selectedDishes.map((dish, dIdx) => (
                                  <div key={dIdx} className="bg-surface border-2 border-text-main rounded-xl p-3 shadow-[2px_2px_0_0_var(--color-text-main)]">
                                     <div className="flex justify-between items-center mb-2">
                                        <h6 className="font-bold text-xs uppercase tracking-widest text-text-main">{dish.name}</h6>
                                        <div className="flex gap-2">
                                           <button onClick={() => {
                                              setDishNameInput(dish.name);
                                              setDishIngredients(dish.ingredients || []);
                                              setEditingDishIdx(dIdx);
                                              setIsAddingToDish(true);
                                           }} className="text-blue-600 hover:text-blue-800"><Edit3 size={14} /></button>
                                           <button onClick={() => {
                                              setSelectedDishes(selectedDishes.filter((_, i) => i !== dIdx));
                                           }} className="text-red-600 hover:text-red-800"><X size={14} /></button>
                                        </div>
                                     </div>
                                     <div className="flex flex-wrap gap-2">
                                        {dish.ingredients?.map((ing: any) => (
                                           <div key={ing.name} className="flex items-center gap-1 bg-[#fde047] text-text-main px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-text-main">
                                              <span className="font-bold opacity-80">{ing.qty}</span>
                                              <span>{ing.name}</span>
                                           </div>
                                        ))}
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}
                         
                         {selectedIngredients.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2 p-3 bg-surface border-2 border-text-main rounded-xl">
                               {selectedIngredients.map(ing => (
                                  <div key={ing.name} className="flex items-center gap-1 bg-[#fde047] text-text-main px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">
                                     <span className="font-bold opacity-80">{ing.qty}</span>
                                     <span>{ing.name}</span>
                                     <button onClick={() => handleRemoveIngredient(ing.name)} className="hover:text-red-600 transition-colors ml-1"><X size={14} /></button>
                                  </div>
                               ))}
                            </div>
                         )}

                         {!isAddingToDish && (
                            <button onClick={() => {
                               setIsAddingToDish(true);
                               setDishNameInput('');
                               setDishIngredients([]);
                               setEditingDishIdx(null);
                            }} className="w-full bg-[#bef264] border-2 border-text-main text-text-main font-black text-[10px] uppercase tracking-widest py-2 rounded-xl mb-2 hover:-translate-y-1 shadow-[2px_2px_0_0_var(--color-text-main)] transition-all flex items-center justify-center gap-2">
                               <Plus size={14} /> Crear Platillo (Agrupar)
                            </button>
                         )}

                         {isAddingToDish && (
                            <div className="bg-[#a3e635] p-3 rounded-xl border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] mb-4 animate-in fade-in">
                               <div className="flex justify-between items-center mb-2">
                                  <h6 className="font-black text-xs uppercase tracking-widest text-text-main">
                                    {editingDishIdx !== null ? 'Editar Platillo' : 'Nuevo Platillo'}
                                  </h6>
                                  <button onClick={() => {
                                     setIsAddingToDish(false);
                                     setDishNameInput('');
                                     setDishIngredients([]);
                                     setEditingDishIdx(null);
                                  }} className="text-text-main hover:opacity-70"><X size={16} /></button>
                               </div>
                               <input 
                                  type="text" 
                                  placeholder="Nombre del platillo..." 
                                  value={dishNameInput}
                                  onChange={e => setDishNameInput(e.target.value)}
                                  className="w-full mb-3 px-3 py-2 border-2 border-text-main rounded-lg font-bold text-sm bg-surface focus:outline-none"
                               />
                               {dishIngredients.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                     {dishIngredients.map(ing => (
                                        <div key={ing.name} className="flex items-center gap-1 bg-surface text-text-main px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-text-main">
                                           <span className="font-bold opacity-80">{ing.qty}</span>
                                           <span>{ing.name}</span>
                                           <button onClick={() => handleRemoveDishIngredient(ing.name)} className="hover:text-red-600 ml-1"><X size={12} /></button>
                                        </div>
                                     ))}
                                  </div>
                               )}
                               <button 
                                  onClick={() => {
                                     if (!dishNameInput) return;
                                     if (editingDishIdx !== null) {
                                        const newDishes = [...selectedDishes];
                                        newDishes[editingDishIdx] = { name: dishNameInput, ingredients: dishIngredients };
                                        setSelectedDishes(newDishes);
                                     } else {
                                        setSelectedDishes([...selectedDishes, { name: dishNameInput, ingredients: dishIngredients }]);
                                     }
                                     setIsAddingToDish(false);
                                     setDishNameInput('');
                                     setDishIngredients([]);
                                     setEditingDishIdx(null);
                                  }} 
                                  className="w-full bg-primary-900 text-white font-black text-xs uppercase tracking-widest py-2 rounded-lg border-2 border-text-main hover:bg-primary-800 transition-colors"
                               >
                                  {editingDishIdx !== null ? 'Actualizar Platillo' : 'Guardar Platillo'}
                               </button>
                            </div>
                         )}

                         <div className="mb-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <input 
                               type="text" 
                               placeholder="Buscar alimento..." 
                               value={searchTerm}
                               onChange={e => setSearchTerm(e.target.value)}
                               className="w-full pl-10 pr-4 py-2 border-2 border-text-main rounded-xl font-bold text-sm bg-surface focus:outline-none focus:shadow-[2px_2px_0_0_var(--color-text-main)] transition-all"
                            />
                         </div>
                         <div className="h-64 overflow-y-auto border-2 border-text-main rounded-xl p-2 bg-surface shadow-inner custom-scrollbar space-y-2">
                            {groupedInventory.map(category => {
                               const isExpanded = expandedCategory === category.name || searchTerm !== '';
                               return (
                               <div key={category.name} className="border-2 border-text-main rounded-xl overflow-hidden shadow-[2px_2px_0_0_var(--color-text-main)]">
                                  <button onClick={() => setExpandedCategory(isExpanded && searchTerm === '' ? null : category.name)} className="w-full flex items-center justify-between p-3 bg-[#bef264] hover:bg-[#a3e635] transition-colors text-left">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-surface border border-text-main flex items-center justify-center text-sm">{category.items[0]?.icon}</div>
                                          <div>
                                             <h6 className="font-bold text-xs uppercase tracking-widest text-text-main">{category.name}</h6>
                                             <p className="text-[9px] font-bold text-text-secondary">{category.items.length} alimentos</p>
                                          </div>
                                      </div>
                                      <div className="w-6 h-6 rounded-full bg-surface border border-text-main flex items-center justify-center">
                                         {isExpanded ? <X size={12} /> : <Plus size={12} />}
                                      </div>
                                  </button>
                                  {isExpanded && (
                                     <div className="bg-surface p-2 border-t-2 border-text-main">
                                        {category.items.map(item => (
                                            <button key={item.id} onClick={() => handleAddIngredient(item)} className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-100 font-bold border-b-2 border-border-subtle last:border-0 transition-colors">
                                               <span className="flex items-center gap-2"><span className="text-lg">{item.icon}</span> {item.name}</span>
                                               <Plus size={14} className="text-text-secondary" />
                                            </button>
                                        ))}
                                     </div>
                                  )}
                               </div>
                               );
                            })}
                         </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button onClick={() => { setShowAddMeal(false); setEditingMealId(null); }} className="flex-1 bg-surface border-2 border-text-main text-text-main font-black uppercase tracking-widest py-3 rounded-xl hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] transition-all">
                          Cancelar
                        </button>
                        <button onClick={handleSaveMeal} className="flex-1 bg-primary-900 border-2 border-text-main text-surface font-black uppercase tracking-widest py-3 rounded-xl hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] transition-all">
                          {editingMealId ? 'Guardar Cambios' : 'Confirmar Comida'}
                        </button>
                      </div>
                    </div>
                    
                    {itemToAdd && (
                       <div className="fixed inset-0 bg-text-main/20 z-[110] flex items-center justify-center p-4 animate-in fade-in">
                          <div className="bg-surface border-2 border-text-main rounded-[24px] p-6 w-full max-w-sm shadow-[8px_8px_0_0_var(--color-text-main)] text-center">
                             <div className="text-4xl mb-2">{itemToAdd.icon}</div>
                             <h3 className="font-display font-black text-xl uppercase tracking-tight text-text-main mb-4">{itemToAdd.name}</h3>
                             
                             <div className="flex flex-col items-center mb-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2 text-left w-full max-w-[280px]">Cantidad</p>
                                <div className="flex items-center gap-4 justify-center w-full max-w-[280px]">
                                   <div className="flex items-center bg-surface border-2 border-text-main rounded-[16px] shadow-[4px_4px_0_0_var(--color-text-main)] overflow-hidden shrink-0">
                                      <button onClick={() => setItemQty(Math.max(1, itemQty - (itemToAdd.unit === 'g' || itemToAdd.unit === 'ml' ? 10 : 1)))} className="w-12 h-12 bg-[#e2e8f0] flex items-center justify-center text-text-main text-2xl font-black border-r-2 border-text-main hover:bg-slate-300 transition-colors">-</button>
                                      <input type="number" value={itemQty} onChange={(e) => setItemQty(Number(e.target.value))} className="w-20 h-12 bg-white text-center font-black text-2xl text-text-main focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                      <button onClick={() => setItemQty(itemQty + (itemToAdd.unit === 'g' || itemToAdd.unit === 'ml' ? 10 : 1))} className="w-12 h-12 bg-[#e2e8f0] flex items-center justify-center text-text-main text-2xl font-black border-l-2 border-text-main hover:bg-slate-300 transition-colors">+</button>
                                   </div>
                                   <span className="text-[10px] font-black uppercase tracking-widest text-text-main bg-[#bef264] px-4 py-2 rounded-full border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] whitespace-nowrap">{itemToAdd.unit}</span>
                                </div>
                             </div>
                             
                             <div className="flex gap-3">
                                <button onClick={() => setItemToAdd(null)} className="flex-1 bg-surface border-2 border-text-main text-text-main font-black uppercase tracking-widest py-3 rounded-xl hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] transition-all">Cancelar</button>
                                <button onClick={() => {
                                   if (isAddingToDish) {
                                      setDishIngredients([...dishIngredients, { name: itemToAdd.name, qty: `${itemQty} ${itemToAdd.unit}`, icon: itemToAdd.icon, ready: true }]);
                                   } else {
                                      setSelectedIngredients([...selectedIngredients, { name: itemToAdd.name, qty: `${itemQty} ${itemToAdd.unit}`, icon: itemToAdd.icon, ready: true }]);
                                   }
                                   setItemToAdd(null);
                                }} className="flex-1 bg-primary-900 border-2 border-text-main text-white font-black uppercase tracking-widest py-3 rounded-xl hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] transition-all">Agregar</button>
                             </div>
                          </div>
                       </div>
                    )}
                </div>
             )}

             {!showAddMeal && (
                 <div className="space-y-4">
                    {meals.map((meal, idx) => (
                       <div 
                          key={meal.id} 
                          draggable
                          onDragStart={() => setDraggedMealIdx(idx)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedMealIdx === null || draggedMealIdx === idx) return;
                            const newMeals = [...meals];
                            const dragged = newMeals[draggedMealIdx];
                            newMeals.splice(draggedMealIdx, 1);
                            newMeals.splice(idx, 0, dragged);
                            setMeals(newMeals);
                            setDraggedMealIdx(idx);
                          }}
                          onDragEnd={() => setDraggedMealIdx(null)}
                          className={`flex justify-between items-center bg-surface border-2 border-text-main p-4 rounded-[20px] shadow-[4px_4px_0_0_var(--color-text-main)] transition-all group ${draggedMealIdx === idx ? 'opacity-50 scale-95' : 'hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-text-main)]'}`}
                       >
                          <div className="flex-1 cursor-pointer" onClick={() => openEditMeal(meal)}>
                             <div className="flex items-center gap-2 mb-1">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{meal.type}</p>
                                <span className="text-primary-500 text-[10px] font-black">•</span>
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{meal.time}</p>
                             </div>
                             <p className="font-display font-black text-lg uppercase tracking-tight text-text-main">{meal.name}</p>
                             <p className="text-[9px] font-bold text-text-secondary mt-1">{meal.ingredients?.length || 0} ingredientes</p>
                          </div>
                          
                          <div className="flex gap-2 shrink-0 items-center">
                             <button onClick={() => openEditMeal(meal)} className="w-10 h-10 bg-blue-500 border-2 border-text-main rounded-full flex items-center justify-center text-white hover:bg-blue-600 shadow-[2px_2px_0_0_var(--color-text-main)] transition-colors">
                                <Edit3 size={18} />
                             </button>
                             <button onClick={() => setMeals(meals.filter((_, i) => i !== idx))} className="w-10 h-10 bg-red-500 border-2 border-text-main rounded-full flex items-center justify-center text-white hover:bg-red-600 shadow-[2px_2px_0_0_var(--color-text-main)] transition-colors">
                                <Trash2 size={18} />
                             </button>
                             <div className="cursor-grab active:cursor-grabbing text-text-secondary hover:text-text-main ml-2 px-1">
                                <GripVertical size={24} />
                             </div>
                          </div>
                       </div>
                    ))}
                    {meals.length === 0 && !showAddMeal && (
                      <div className="text-center p-8 border-2 border-dashed border-text-main rounded-[24px] bg-slate-50">
                        <p className="font-bold text-text-secondary text-sm">Aún no has agregado comidas.</p>
                      </div>
                    )}
                 </div>
             )}
          </div>

          {onDelete && (
             <div className="w-full">
             {!showDeleteConfirm ? (
               <button onClick={() => setShowDeleteConfirm(true)} className="w-full bg-red-500 border-2 border-text-main text-white font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-red-100 hover:text-red-600 transition-all mt-6 mb-4 neo-btn">
                 Eliminar Menú <Trash2 size={18} />
               </button>
             ) : (
               <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mt-6 mb-4 animate-in fade-in zoom-in-95">
                 <p className="font-bold text-red-600 text-sm mb-3 text-center">¿Eliminar permanentemente este menú?</p>
                 <div className="flex gap-2">
                   <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-surface border-2 border-text-main text-text-main font-black uppercase text-xs py-2 rounded-lg hover:bg-slate-100 transition-colors">
                     Cancelar
                   </button>
                   <button onClick={onDelete} className="flex-1 bg-red-600 border-2 border-text-main text-white font-black uppercase text-xs py-2 rounded-lg hover:bg-red-700 transition-colors">
                     Sí, Eliminar
                   </button>
                 </div>
               </div>
             )}
             </div>
          )}
          <button onClick={() => onSave({ title, meals, coverImage, themeColor })} className="w-full bg-accent-500 border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-accent-400 transition-all neo-btn">
            Guardar Cambios <ArrowRight size={18} />
          </button>
      </div>
    </div>
  );
}
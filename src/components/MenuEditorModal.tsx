import React, { useState } from 'react';
import { X, Plus, Trash2, ArrowRight, Edit3 } from 'lucide-react';
import { mockInventory } from '../data';

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
  return `${hours.padStart(2, '0')}:\${minutes}`;
}

function formatTo12h(timeStr: string) {
  if (!timeStr) return '12:00 PM';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  let [hours, minutes] = timeStr.split(':');
  const h = Number(hours);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, '0')}:\${minutes} \${period}`;
}

export default function MenuEditorModal({ menu, onClose, onSave, onDelete }: MenuEditorProps) {
  const [title, setTitle] = useState(menu.title);
  const [coverImage, setCoverImage] = useState(menu.coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80');
  const [meals, setMeals] = useState<any[]>(menu.meals || []);
  
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  
  const [newMealName, setNewMealName] = useState('');
  const [newMealType, setNewMealType] = useState('COLACIÓN');
  const [newMealTime, setNewMealTime] = useState('12:00 PM');
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddIngredient = (item: any) => {
    if (selectedIngredients.find(i => i.name === item.name)) return;
    setSelectedIngredients([...selectedIngredients, { name: item.name, qty: '1 porción', icon: item.icon, ready: true }]);
  };

  const handleRemoveIngredient = (name: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.name !== name));
  };

  const openAddMeal = () => {
    setEditingMealId(null);
    setNewMealName('');
    setNewMealType('COLACIÓN');
    setNewMealTime('12:00 PM');
    setSelectedIngredients([]);
    setShowAddMeal(true);
  };
  
  const openEditMeal = (meal: any) => {
    setEditingMealId(meal.id);
    setNewMealName(meal.name);
    setNewMealType(meal.type);
    setNewMealTime(meal.time);
    setSelectedIngredients(meal.ingredients || []);
    setShowAddMeal(true);
  };

  const handleSaveMeal = () => {
    if (!newMealName) return;
    
    if (editingMealId) {
       setMeals(meals.map(m => m.id === editingMealId ? {
          ...m,
          name: newMealName,
          type: newMealType,
          time: newMealTime,
          ingredients: selectedIngredients
       } : m));
    } else {
       const newMeal = {
         id: 'meal-' + Date.now(),
         type: newMealType,
         time: newMealTime,
         name: newMealName,
         status: 'available',
         statusText: 'Disponible',
         icon: '🍽️',
         ingredients: selectedIngredients
       };
       setMeals([...meals, newMeal]);
    }
    
    setShowAddMeal(false);
    setEditingMealId(null);
    setNewMealName('');
    setSelectedIngredients([]);
  };

  return (
    <div className="fixed inset-0 bg-text-main/20  z-[100] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-surface border-2 border-text-main rounded-[32px] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto neo-card shadow-[8px_8px_0_0_var(--color-text-main)] custom-scrollbar">
        
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-text-main">Editar Menú</h3>
            <button onClick={onClose} className="w-10 h-10 rounded-full border-2 border-text-main flex items-center justify-center neo-btn bg-surface hover:bg-slate-100 shrink-0">
               <X size={20} />
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
             <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80","https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80","https://images.unsplash.com/photo-149883716733f-a5189f104c21?w=400&q=80","https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80","https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80","https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80"].map(img => (
                   <img 
                      key={img}
                      src={img}
                      alt="Cover option"
                      onClick={() => setCoverImage(img)}
                      className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition-all ${coverImage === img ? 'border-primary-900 shadow-[4px_4px_0_0_var(--color-primary-900)] scale-110' : 'border-transparent hover:border-text-main'}`}
                   />
                ))}
             </div>
             <div className="mt-3">
                <input 
                   type="text" 
                   placeholder="Pega aquí la URL de tu imagen o ruta local (ej. /foto.jpg)" 
                   value={coverImage} 
                   onChange={e => setCoverImage(e.target.value)} 
                   className="w-full bg-surface border-2 border-text-main rounded-xl p-3 text-sm font-bold text-text-main focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] shadow-[4px_4px_0_0_var(--color-text-main)] transition-all"
                />
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
                         
                         {selectedIngredients.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2 p-3 bg-surface border-2 border-text-main rounded-xl">
                               {selectedIngredients.map(ing => (
                                  <div key={ing.name} className="flex items-center gap-1 bg-[#fde047] text-text-main px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">
                                     {ing.name}
                                     <button onClick={() => handleRemoveIngredient(ing.name)} className="hover:text-red-600 transition-colors ml-1"><X size={14} /></button>
                                  </div>
                               ))}
                            </div>
                         )}

                         <div className="h-40 overflow-y-auto border-2 border-text-main rounded-xl p-2 bg-surface shadow-inner custom-scrollbar">
                            {mockInventory.map(item => (
                               <button key={item.id} onClick={() => handleAddIngredient(item)} className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-100 font-bold border-b-2 border-border-subtle last:border-0 transition-colors">
                                  <span className="flex items-center gap-2"><span className="text-lg">{item.icon}</span> {item.name}</span>
                                  <Plus size={14} className="text-text-secondary" />
                               </button>
                            ))}
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
                </div>
             )}

             {!showAddMeal && (
                 <div className="space-y-4">
                    {meals.map((meal, idx) => (
                       <div key={meal.id} className="flex justify-between items-center bg-surface border-2 border-text-main p-4 rounded-[20px] shadow-[4px_4px_0_0_var(--color-text-main)] hover:shadow-[6px_6px_0_0_var(--color-text-main)] hover:-translate-y-1 transition-all group">
                          <div className="flex-1" onClick={() => openEditMeal(meal)}>
                             <div className="flex items-center gap-2 mb-1">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{meal.type}</p>
                                <span className="text-primary-500 text-[10px] font-black">•</span>
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{meal.time}</p>
                             </div>
                             <p className="font-display font-black text-lg uppercase tracking-tight text-text-main">{meal.name}</p>
                             <p className="text-[9px] font-bold text-text-secondary mt-1">{meal.ingredients?.length || 0} ingredientes</p>
                          </div>
                          
                          <div className="flex gap-2 shrink-0">
                             <button onClick={() => openEditMeal(meal)} className="w-10 h-10 bg-surface border-2 border-text-main rounded-full flex items-center justify-center text-text-main hover:bg-[#fde047] shadow-[2px_2px_0_0_var(--color-text-main)] transition-colors">
                                <Edit3 size={18} />
                             </button>
                             <button onClick={() => setMeals(meals.filter((_, i) => i !== idx))} className="w-10 h-10 bg-surface border-2 border-text-main rounded-full flex items-center justify-center text-text-main hover:bg-red-400 hover:text-white shadow-[2px_2px_0_0_var(--color-text-main)] transition-colors">
                                <Trash2 size={18} />
                             </button>
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
               <button onClick={() => setShowDeleteConfirm(true)} className="w-full bg-red-100 border-2 border-text-main text-red-600 font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-red-500 hover:text-white transition-all mt-6 mb-4 neo-btn">
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
          <button onClick={() => onSave({ title, meals, coverImage })} className="w-full bg-accent-500 border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-accent-400 transition-all neo-btn">
            Guardar Cambios <ArrowRight size={18} />
          </button>
      </div>
    </div>
  );
}
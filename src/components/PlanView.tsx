import React, { useState } from 'react';
import { ArrowRight, AlertTriangle, ArrowLeft, X, Edit3, Plus, Trash2, Check } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import MenuEditorModal from './MenuEditorModal';
import { useAppData } from '../hooks/useAppData';
import { mockMenus } from '../data';
import { getNutritionalSummary } from '../data/equivalences';

export default function PlanView() {
  const { menus, activeMenus, assignMenuToDate, updateMenu, deleteMenu } = useAppData();
  
  const [sortOrder, setSortOrder] = useState<'latest' | 'alpha'>('latest');

  const parseMenu = (m: any) => m ? { ...m, meals: typeof m.meals === 'string' ? JSON.parse(m.meals) : (m.meals || []) } : undefined;

  
  const sortedMenus = [...menus.map(m => parseMenu(m))].sort((a, b) => {
    if (sortOrder === 'alpha') {
      return a.title.localeCompare(b.title);
    } else {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
      return bTime - aTime;
    }
  });
  const [view, setView] = useState<'semana' | 'menus'>('semana');
  const currentD = new Date(); const dow = currentD.getDay(); const [selectedDay, setSelectedDay] = useState(dow === 0 ? 6 : dow - 1);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [showMenuSelector, setShowMenuSelector] = useState(false);
  const [showMenuEditor, setShowMenuEditor] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());

  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localD = new Date(d.getTime() - tzOffset);
  const currentDayOfWeek = localD.getDay(); // 0 is Sunday, 1 is Monday
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(localD.getTime() + mondayOffset * 24 * 60 * 60 * 1000);
  
  const daysNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const days = Array.from({length: 7}).map((_, i) => {
    const dayDate = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
    return {
      name: daysNames[i],
      date: dayDate.getDate(),
      fullDate: dayDate,
      id: `day_${i}`
    };
  });

  const todayDateId = `day_${dow === 0 ? 6 : dow - 1}`;

  const selectedDateId = days[selectedDay].id;
  const activeForDay = activeMenus.find(a => a.dateId === selectedDateId);
  
  let currentMenu: any = null;
  if (activeForDay) {
     currentMenu = parseMenu(menus.find(m => m.id === activeForDay.menuId));
  }

  const assignMenu = (menuId: string) => {
     assignMenuToDate(selectedDateId, menuId);
     setShowMenuSelector(false);
  };

  const menuToEdit = selectedMenuId ? parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu : currentMenu;
  const firestoreMenuToEdit = selectedMenuId ? menus.find(m => m.id === selectedMenuId) : (menuToEdit ? menus.find(m => m.id === menuToEdit.id) : null);
  
  if (selectedMenuId) {
     const menu = parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu;
     if (!menu) return <div className="p-8 text-center"><button onClick={() => setSelectedMenuId(null)} className="neo-btn px-4 py-2 bg-surface border-2 border-text-main rounded-full">Volver</button></div>;
     return (
        <div className="flex flex-col pb-24 animate-in slide-in-from-bottom-8 fade-in duration-300">
           <header className="pt-2 pb-4 flex items-center gap-4 border-b-2 border-border-subtle mb-6 sticky top-0 bg-background/95  z-20">
                 <button onClick={() => setSelectedMenuId(null)} className="w-10 h-10 rounded-full border-2 border-text-main flex items-center justify-center neo-btn bg-surface hover:bg-slate-100 shrink-0">
                    <ArrowLeft size={20} />
                 </button>
                 <div>
                    <h1 className="text-2xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight uppercase">{menu.title}</h1>
                 </div>
           </header>

           <div className="space-y-6">
              {menu.meals.map((meal) => {
                 const readyCount = meal.ingredients?.filter(i => i.ready).length || 0;
                 const totalCount = meal.ingredients?.length || 0;
                 const progress = totalCount === 0 ? 0 : (readyCount / totalCount) * 100;

                 return (
                    <div key={meal.id} className="bg-surface border-2 border-text-main rounded-[24px] flex flex-col neo-card shadow-[6px_6px_0_0_var(--color-text-main)] overflow-hidden">
                       {(() => {
     const macros = getNutritionalSummary((meal.ingredients || []).map(i => ({ name: i.name, amount: i.qty })));
     return (
       <div className="border-b-2 border-text-main">
         <div className="p-4 flex justify-between items-center bg-accent-100">
            <h3 className="font-display font-black text-lg uppercase tracking-tight">{meal.type}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest bg-surface px-3 py-1 rounded-full border-2 border-text-main">{meal.time}</span>
         </div>
         <div className="bg-surface px-4 py-2 flex justify-between text-[10px] font-black uppercase tracking-widest text-text-secondary border-t-2 border-border-subtle">
            <span>{macros.kcal} kcal</span>
            <span className="flex gap-3">
               <span>P: {macros.p}g</span>
               <span>C: {macros.c}g</span>
               <span>G: {macros.f}g</span>
            </span>
         </div>
       </div>
     );
  })()}
  <div className="p-4 md:p-6">
                          {/* Grid for Ingredients */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                   {meal.ingredients?.map((ing, idx) => (
                                      <div key={idx} className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-2 p-3 bg-background border-2 border-border-subtle rounded-[16px] hover:border-text-main transition-colors">
                                         <div className="text-2xl sm:text-3xl bg-surface w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-text-main shadow-sm shrink-0">{ing.icon}</div>
                                         <div className="hidden sm:block w-6 h-0.5 bg-border-subtle"></div>
                                         <div className="flex flex-col sm:items-center w-full">
                                            <p className="font-bold text-sm text-text-main leading-tight text-center">{ing.name}</p>
                                            <p className="text-[10px] font-black text-text-secondary uppercase mt-1 text-center">{ing.qty}</p>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                          </div>
                    </div>
                 );
              })}
           {/* FAB Edit Menu inside Selected Menu View */}
           <div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-[60]">
              <button onClick={() => setShowMenuEditor(true)} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">
                 <Edit3 size={24} />
              </button>
           </div>

           {/* Menu Editor Modal */}
           {showMenuEditor && (
              <MenuEditorModal 
                 menu={menuToEdit} 
                 onClose={() => setShowMenuEditor(false)} 
                 onSave={async (updates) => {
                    if (firestoreMenuToEdit && updateMenu) {
                       await updateMenu(firestoreMenuToEdit.id, {
                          title: updates.title,
                          meals: JSON.stringify(updates.meals),
                          coverImage: updates.coverImage
                       });
                    }
                    setShowMenuEditor(false);
                 }}
                 onDelete={async () => {
                    console.log("Delete triggered for:", firestoreMenuToEdit);
                    if (firestoreMenuToEdit && deleteMenu) {
                       await deleteMenu(firestoreMenuToEdit.id);
                       setSelectedMenuId(null);
                    } else {
                       console.error("Cannot delete, firestoreMenuToEdit or deleteMenu is null", { firestoreMenuToEdit, deleteMenu: !!deleteMenu, menuToEdit });
                       // Alert removed to avoid iframe issues
                    }
                    setShowMenuEditor(false);
                 }}
              />
           )}

           </div>

        </div>
     );
  }

  return (
     <div className="flex flex-col gap-8 pb-10">
        <header className="pt-2 flex justify-between items-center">
           <h1 className="text-3xl md:text-4xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight uppercase">Mi Plan</h1>
           <div className="w-10 h-10 rounded-full border-2 border-text-main bg-primary-900 text-surface flex items-center justify-center font-display font-bold neo-card shadow-[3px_3px_0_0_var(--color-text-main)]">
             I
           </div>
        </header>

        {/* Segmented Control */}
        <div className="bg-background rounded-full p-1.5 flex border-2 border-border-subtle neo-card shadow-none">
           <button
              className={`flex-1 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${view === 'semana' ? 'bg-primary-900 text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'text-text-secondary hover:text-text-main'}`}
              onClick={() => setView('semana')}
           >
              Semana
           </button>
           <button
              className={`flex-1 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${view === 'menus' ? 'bg-primary-900 text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'text-text-secondary hover:text-text-main'}`}
              onClick={() => setView('menus')}
           >
              Menús
           </button>
        </div>

        {view === 'semana' ? (
           <>
              {/* Days Row */}
              <div className="flex justify-between md:justify-start md:gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x">
                 {days.map((d, i) => {
                    const assignedMenu = activeMenus.find(a => a.dateId === d.id);
                    const hasMenuAssigned = !!assignedMenu && assignedMenu.menuId !== '';
                    let dayClass = '';
                    let dotClass = '';
                    if (selectedDay === i) {
                       if (hasMenuAssigned) {
                           dayClass = 'bg-accent-500 !border-[#00E676] !border-[3px] text-text-main shadow-[4px_4px_0_0_var(--color-text-main)] -translate-y-1';
                           dotClass = 'bg-[#00E676] w-2 h-2';
                       } else {
                           dayClass = 'bg-accent-500 !border-[#FF3D00] !border-[3px] text-text-main shadow-[4px_4px_0_0_var(--color-text-main)] -translate-y-1';
                           dotClass = 'bg-[#FF3D00] w-2 h-2';
                       }
                    } else if (hasMenuAssigned) {
                       dayClass = 'bg-[#00E676] !border-text-main text-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1';
                       dotClass = 'bg-text-main w-1.5 h-1.5';
                    } else {
                       dayClass = 'bg-[#FF3D00] !border-text-main text-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1';
                       dotClass = 'bg-text-main w-1.5 h-1.5';
                    }

                    return (
                    <button onClick={() => setSelectedDay(i)} key={i} className={`flex flex-col items-center justify-center w-14 sm:w-16 min-w-[56px] py-4 rounded-[20px] border-2 transition-all shrink-0 snap-center mx-1 md:mx-0 ${dayClass}`}>
                       <span className="text-[10px] font-black uppercase tracking-widest mb-1.5">{d.name}</span>
                       <span className="text-xl font-black">{d.date}</span>
                       <div className={`rounded-full mt-2 ${dotClass}`}></div>
                    </button>
                 )})}

              </div>

              {/* Repetition Alert */}
              <div className="bg-yellow-100 border-2 border-text-main rounded-[20px] p-4 flex items-center justify-between shadow-[4px_4px_0_0_var(--color-text-main)]">
                 <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-yellow-600" />
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-yellow-800">Repetición Consecutiva</p>
                       <div className="flex gap-1 mt-1">
                          <span className="text-[8px]">●</span>
                          <span className="text-[8px]">●</span>
                          <span className="text-[8px] opacity-30">○</span>
                       </div>
                    </div>
                 </div>
                 <span className="text-xs font-black text-yellow-800">2 / 2</span>
              </div>

              {/* Day's Menu Container */}
              <div className="flex flex-col gap-4">
                 {currentMenu ? (
                 <>
                    <div className="flex justify-between items-end mb-2">
                       <div>
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Horario de Comidas</p>
                          <h2 className="text-2xl font-display font-black text-text-main tracking-tight uppercase">{currentMenu.title}</h2>
                       </div>
                       <div className="flex gap-2">
                          
                          <button onClick={() => setShowMenuSelector(true)} className="text-[10px] bg-primary-900 text-surface border-2 border-text-main font-black uppercase tracking-widest hover:bg-primary-800 transition-colors px-4 py-2 rounded-full shadow-[2px_2px_0_0_var(--color-text-main)]">
                             Elegir Menú
                          </button>
                       </div>
                    </div>

                    {/* Meals List */}
                    <div className="space-y-6">
                       {currentMenu.meals.map((meal: any) => {
                       const readyCount = meal.ingredients?.filter(i => i.ready).length || 0;
                       const totalCount = meal.ingredients?.length || 0;
                       const progress = totalCount === 0 ? 0 : (readyCount / totalCount) * 100;

                       return (
                          <div key={meal.id} className="bg-surface border-2 border-text-main rounded-[24px] flex flex-col neo-card shadow-[6px_6px_0_0_var(--color-text-main)] overflow-hidden">
                             {(() => {
     const macros = getNutritionalSummary((meal.ingredients || []).map(i => ({ name: i.name, amount: i.qty })));
     return (
       <div className="border-b-2 border-text-main">
         <div className="p-4 flex justify-between items-center bg-accent-100">
            <h3 className="font-display font-black text-lg uppercase tracking-tight">{meal.type}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest bg-surface px-3 py-1 rounded-full border-2 border-text-main">{meal.time}</span>
         </div>
         <div className="bg-surface px-4 py-2 flex justify-between text-[10px] font-black uppercase tracking-widest text-text-secondary border-t-2 border-border-subtle">
            <span>{macros.kcal} kcal</span>
            <span className="flex gap-3">
               <span>P: {macros.p}g</span>
               <span>C: {macros.c}g</span>
               <span>G: {macros.f}g</span>
            </span>
         </div>
       </div>
     );
  })()}
  <div className="p-4 md:p-6">
                                {/* Grid for Ingredients */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                   {meal.ingredients?.map((ing, idx) => (
                                      <div key={idx} className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-2 p-3 bg-background border-2 border-border-subtle rounded-[16px] hover:border-text-main transition-colors">
                                         <div className="text-2xl sm:text-3xl bg-surface w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-text-main shadow-sm shrink-0">{ing.icon}</div>
                                         <div className="hidden sm:block w-6 h-0.5 bg-border-subtle"></div>
                                         <div className="flex flex-col sm:items-center w-full">
                                            <p className="font-bold text-sm text-text-main leading-tight text-center">{ing.name}</p>
                                            <p className="text-[10px] font-black text-text-secondary uppercase mt-1 text-center">{ing.qty}</p>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                          </div>
                    </div>
                 );
              })}
                 </div>
                 </>
                 ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-surface border-2 border-dashed border-text-main rounded-[24px] mt-4">
                       <p className="text-sm font-bold text-text-secondary mb-4 text-center">No hay un menú asignado para este día.</p>
                       <button onClick={() => setShowMenuSelector(true)} className="text-[10px] bg-primary-900 text-surface border-2 border-text-main font-black uppercase tracking-widest hover:bg-primary-800 transition-colors px-6 py-3 rounded-full shadow-[2px_2px_0_0_var(--color-text-main)] neo-btn hover:-translate-y-1">
                          Elegir Menú
                       </button>
                    </div>
                 )}
              </div>
           </>
        ) : (
           <>
           <div className="flex justify-between items-center mt-6 mb-4">
               <h3 className="font-black text-sm uppercase tracking-widest text-text-secondary">Mis Menús</h3>
               <div className="flex bg-surface border-2 border-text-main rounded-full overflow-hidden shadow-[2px_2px_0_0_var(--color-text-main)]">
                  <button 
                     onClick={() => setSortOrder('latest')} 
                     className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${sortOrder === 'latest' ? 'bg-primary-900 text-surface' : 'hover:bg-slate-50 text-text-main'}`}
                  >
                     Más recientes
                  </button>
                  <div className="w-0.5 bg-text-main"></div>
                  <button 
                     onClick={() => setSortOrder('alpha')} 
                     className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${sortOrder === 'alpha' ? 'bg-primary-900 text-surface' : 'hover:bg-slate-50 text-text-main'}`}
                  >
                     Alfabético
                  </button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-2 pb-10">
              {sortedMenus.map((menu, i) => (
                 <div key={menu.id} onClick={() => {
                     if (selectionMode) {
                        const newSet = new Set(selectedForDeletion);
                        if (newSet.has(menu.id)) newSet.delete(menu.id);
                        else newSet.add(menu.id);
                        setSelectedForDeletion(newSet);
                     } else {
                        setSelectedMenuId(menu.id);
                     }
                  }} className={`relative bg-surface border-2 ${selectionMode && selectedForDeletion.has(menu.id) ? 'border-red-500 shadow-[6px_6px_0_0_#ef4444] -translate-y-1' : 'border-text-main hover:shadow-[6px_6px_0_0_var(--color-text-main)] hover:-translate-y-1'} rounded-[24px] overflow-hidden neo-card flex flex-col cursor-pointer transition-all`}>
                     {selectionMode && (
                        <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-text-main flex items-center justify-center z-10 ${selectedForDeletion.has(menu.id) ? 'bg-red-500 text-white' : 'bg-surface'}`}>
                           {selectedForDeletion.has(menu.id) && <Check size={14} />}
                        </div>
                     )}
                    <div className="h-28 sm:h-40 bg-slate-200 border-b-2 border-text-main">
                       <img src={menu.coverImage || `https://images.unsplash.com/photo-${i % 2 === 0 ? '1546069901-ba9599a7e63c' : '1490645935967-10de6ba17061'}?w=400&q=80`} alt="Menu" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 sm:p-5 flex flex-col justify-between h-full">
                       <div>
                          <h3 className="text-sm sm:text-xl font-display font-black text-text-main mb-1 sm:mb-2 uppercase tracking-tight">{menu.title}</h3>
                          <p className="text-[8px] sm:text-[11px] font-bold text-text-secondary uppercase tracking-wider leading-tight">{menu.meals.length} comidas<br className="sm:hidden"/> <span className="hidden sm:inline">•</span> {menu.meals.reduce((acc, curr) => acc + (curr.ingredients?.length || 0), 0)} alimentos</p>
                       </div>
                       <div className="mt-3 flex justify-end">
                          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent-500 border-2 border-text-main flex items-center justify-center neo-btn shrink-0 text-text-main hover:bg-accent-400">
                             <ArrowRight size={14} className="sm:hidden" />
                             <ArrowRight size={16} className="hidden sm:block" />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
           
           {/* FABs for Menus View */}
           <div className="fixed bottom-28 md:bottom-12 right-6 md:right-12 flex flex-col items-end gap-3 z-40">
              {selectionMode ? (
                 <>
                    <button 
                       onClick={() => {
                          setSelectionMode(false);
                          setSelectedForDeletion(new Set());
                       }} 
                       className="bg-surface text-text-main w-12 h-12 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-slate-100 transition-all hover:-translate-y-1 animate-in zoom-in-90"
                    >
                       <X size={20} />
                    </button>
                    <button 
                       onClick={async () => {
                          if (selectedForDeletion.size > 0 && window.confirm(`¿Eliminar ${selectedForDeletion.size} menú(s)?`)) {
                             for (const id of Array.from(selectedForDeletion)) {
                                await deleteMenu(id);
                             }
                             setSelectionMode(false);
                             setSelectedForDeletion(new Set());
                          }
                       }} 
                       className="bg-red-500 text-white px-4 h-14 rounded-full font-black flex items-center justify-center gap-2 border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-red-600 transition-all hover:-translate-y-1 animate-in zoom-in-90"
                    >
                       <Trash2 size={24} />
                       <span className="uppercase tracking-widest text-xs">Eliminar ({selectedForDeletion.size})</span>
                    </button>
                 </>
              ) : (
                 <>
                    <button 
                       onClick={() => {
                          setSelectionMode(true);
                       }} 
                       className="bg-surface text-text-main w-12 h-12 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-slate-100 transition-all hover:-translate-y-1 animate-in zoom-in-90"
                    >
                       <Trash2 size={20} />
                    </button>
                    <button 
                       onClick={() => {
                          setSelectedMenuId(null);
                          setShowMenuEditor(true);
                       }} 
                       className="bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1 animate-in zoom-in-90"
                    >
                       <Plus size={28} />
                    </button>
                 </>
              )}
           </div>
           
           </>
        )}

        
        
        


        
        {/* Menu Selector Modal */}
        {showMenuSelector && (
           <div className="fixed inset-0 bg-text-main/20  z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
              <div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md neo-card shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)] max-h-[85vh] overflow-y-auto relative">
                 <div className="flex justify-between items-center mb-6 sticky top-0 bg-surface z-10 py-2">
                    <h3 className="text-xl font-display font-black text-text-main uppercase tracking-tight">Elegir Menú</h3>
                    <button onClick={() => setShowMenuSelector(false)} className="w-8 h-8 bg-background border-2 border-border-subtle rounded-full flex items-center justify-center text-text-secondary hover:text-text-main hover:border-text-main">
                       <X size={16} />
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => assignMenu('')} className={`w-full flex flex-col items-start justify-between p-4 rounded-[20px] border-2 transition-all ${!activeForDay?.menuId ? 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'bg-surface border-border-subtle hover:border-text-main text-text-main'}`}>
                       <div className="text-left mb-4">
                          <h4 className="font-black text-sm uppercase tracking-widest">Sin asignar</h4>
                       </div>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center self-end ${!activeForDay?.menuId ? 'border-surface bg-surface text-primary-900' : 'border-border-subtle bg-transparent'}`}>
                          {!activeForDay?.menuId && <div className="w-2.5 h-2.5 rounded-full bg-primary-900"></div>}
                       </div>
                    </button>
                    {sortedMenus.map((menu) => (
                       <button key={menu.id} onClick={() => assignMenu(menu.id)} className={`w-full flex flex-col items-start justify-between p-4 rounded-[20px] border-2 transition-all ${activeForDay?.menuId === menu.id ? 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'bg-surface border-border-subtle hover:border-text-main text-text-main'}`}>
                          <div className="text-left mb-4">
                             <h4 className="font-black text-sm uppercase tracking-widest">{menu.title}</h4>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center self-end ${activeForDay?.menuId === menu.id ? 'border-surface bg-surface text-primary-900' : 'border-border-subtle bg-transparent'}`}>
                             {activeForDay?.menuId === menu.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-900"></div>}
                          </div>
                       </button>
                    ))}
                 </div>
                 

              </div>
            </div>
         )}
      </div>
   );
}

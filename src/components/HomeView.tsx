import React, { useEffect, useState } from 'react';
import { Bell, ArrowRight, Calendar, ShoppingCart, RefreshCcw, LayoutGrid, ChevronDown } from 'lucide-react';
import { mockMenus, mockMissing } from '../data';
import { StatusBadge } from './StatusBadge';
import { useAppData } from '../hooks/useAppData';
import ConsumptionTracker, { TrackedItem } from './ConsumptionTracker';
import { useConsumption } from '../hooks/useConsumption';
import { getNutritionalSummary } from '../data/equivalences';
import EquivalenceSwapModal from './EquivalenceSwapModal';


export default function HomeView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
    const { menus, activeMenus, seedData, updateMenu, inventory } = useAppData();
    
  const getMenuColors = (themeColor: string = 'amarillo') => {
    switch (themeColor) {
      case 'azul': return { bg: 'bg-blue-400', lightBg: 'bg-blue-100', text: 'text-text-main' };
      case 'verde': return { bg: 'bg-green-400', lightBg: 'bg-green-100', text: 'text-text-main' };
      case 'naranja': return { bg: 'bg-orange-500', lightBg: 'bg-orange-100', text: 'text-text-main' };
      case 'amarillo':
      default: return { bg: 'bg-[#fde047]', lightBg: 'bg-yellow-100', text: 'text-text-main' };
    }
  };

  const getTextColor = (themeColor: string = 'amarillo') => {
    switch (themeColor) {
      case 'azul': return 'text-blue-400';
      case 'verde': return 'text-green-400';
      case 'naranja': return 'text-orange-500';
      case 'amarillo':
      default: return 'text-[#fde047]';
    }
  };

  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localD = new Date(d.getTime() - tzOffset);
  const todayDateId = localD.toISOString().split('T')[0];
  const currentDayOfWeek = localD.getDay();
  const todayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const { logs, saveConsumption } = useConsumption(todayDateId);
  const [activeMealTracker, setActiveMealTracker] = useState<any>(null);
  const [expandedMeals, setExpandedMeals] = useState<string[]>([]);
  const [swapTarget, setSwapTarget] = useState<{mealId: string, ingredient: any} | null>(null);

  const handleSwapIngredient = async (newIngredient: any) => {
     if (!swapTarget) return;
     if (activeToday) {
         const firestoreMenu = menus.find(m => m.id === activeToday.menuId);
         if (firestoreMenu) {
             const updatedMeals = (typeof firestoreMenu.meals === 'string' ? JSON.parse(firestoreMenu.meals) : firestoreMenu.meals).map((meal: any) => {
                 if (meal.id === swapTarget.mealId) {
                     return {
                         ...meal,
                         ingredients: meal.ingredients.map((ing: any) => 
                             ing.name === swapTarget.ingredient.name ? newIngredient : ing
                         )
                     };
                 }
                 return meal;
             });
             await updateMenu(firestoreMenu.id, { meals: JSON.stringify(updatedMeals) });
         }
     }
     setSwapTarget(null);
  };

  const toggleMeal = (mealId: string) => {
    setExpandedMeals(prev => prev.includes(mealId) ? prev.filter(id => id !== mealId) : [...prev, mealId]);
  };

  useEffect(() => {
    seedData();
  }, []);

  const activeToday = activeMenus.find(a => a.dateId === `day_${todayIndex}`);
  let todayMenu: any = null;
  
  if (activeToday) {
     const firestoreMenu = menus.find(m => m.id === activeToday.menuId);
     const mockMenu = mockMenus.find(m => m.id === activeToday.menuId);
     
     if (firestoreMenu) {
        todayMenu = {
           ...firestoreMenu,
           meals: typeof firestoreMenu.meals === 'string' ? JSON.parse(firestoreMenu.meals) : firestoreMenu.meals
        };
     } else if (mockMenu) {
        todayMenu = mockMenu;
     }
  }

  
    const allIngredients = todayMenu?.meals?.flatMap((m: any) => m.ingredients || []) || [];
  const uniqueIngredients = Object.values(allIngredients.reduce((acc: any, ing: any) => {
     if (!acc[ing.name]) acc[ing.name] = ing;
     return acc;
  }, {}));
  
  const evaluatedIngredients = uniqueIngredients.map((ing: any) => {
      const inventoryMatch = inventory.find(item => item.name.toLowerCase() === ing.name.toLowerCase());
      const isReady = inventoryMatch ? inventoryMatch.amount > 0 : (ing.ready !== false);
      return { ...ing, isReady };
  });
  
  const missingIngredients = evaluatedIngredients.filter(i => !i.isReady);
  const readyIngredients = evaluatedIngredients.filter(i => i.isReady);
  const hasMissingAlert = todayMenu && missingIngredients.length > 0;
  const missingCount = missingIngredients.length;
  const readyCount = readyIngredients.length;
  const totalCount = evaluatedIngredients.length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex justify-between items-end pt-2">
        <div>
          <p className="text-[10px] font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] uppercase tracking-widest mb-1.5">{localD.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight">Hola, Iván <span className="text-2xl">👋</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full border-2 border-text-main flex items-center justify-center bg-surface neo-btn hover:bg-slate-50 transition-colors">
            <Bell size={18} className="text-text-main" />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-text-main flex items-center justify-center bg-primary-900 text-surface font-bold font-display neo-card shadow-[3px_3px_0_0_var(--color-text-main)]">
            I
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary-900 rounded-[32px] p-6 md:p-8 text-surface shadow-[8px_8px_0_0_var(--color-text-main)] border-2 border-text-main relative overflow-hidden flex flex-col">
         <div className="absolute -right-20 -top-20 w-72 h-72 bg-white opacity-5 rounded-full  pointer-events-none"></div>
         <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-300">Hoy</span>
            <h2 className="text-3xl md:text-4xl font-display font-black leading-[1.1] mt-1.5 mb-6">Tu alimentación<br/>está lista.</h2>

            {/* Next Meal */}
            {(() => {
               if (!todayMenu || !todayMenu.meals || todayMenu.meals.length === 0) {
                  return (
                     <div className="bg-[#fde047] text-text-main rounded-[24px] p-4 flex gap-4 items-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)]">
                        <div className="flex-1 flex flex-col gap-2">
                           <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">No hay menú activo</p>
                             <h3 className="font-display font-black text-xl uppercase mb-1">Día Libre</h3>
                             <p className="text-[11px] font-bold">Asigna un menú desde tu plan para comenzar.</p>
                           </div>
                           <button onClick={() => onNavigate?.('plan')} className="bg-primary-900 text-surface text-xs font-black uppercase tracking-widest py-3 px-6 rounded-full border-2 border-text-main neo-btn shadow-[2px_2px_0_0_var(--color-text-main)] self-start mt-2 hover:-translate-y-1">
                              Elegir Menú
                           </button>
                        </div>
                     </div>
                  );
               }
               const nextMeal = todayMenu.meals.find((m: any) => !logs.includes(m.id)) || todayMenu.meals[0];
               const ingredientSummary = (nextMeal.ingredients || []).map((i: any) => i.name).join(' - ') || 'Ver detalles';
               return (
                  <div className={`${getMenuColors(todayMenu.themeColor).bg} ${getMenuColors(todayMenu.themeColor).text} rounded-[24px] p-4 flex gap-4 items-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-text-main)] transition-all`} onClick={() => onNavigate?.('plan')}>
                     <div className="flex-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">Próxima Comida ({nextMeal.time})</p>
                        <h3 className="font-display font-black text-xl uppercase mb-1">{nextMeal.type}</h3>
                        <p className="text-[11px] font-bold mb-3 line-clamp-1">{nextMeal.name}</p>
                        <div className="flex items-center gap-2">
                          {nextMeal.ingredients && nextMeal.ingredients.every(i => i.ready) ? (
                            <StatusBadge status="available" text="Ingredientes listos" />
                          ) : (
                            <StatusBadge status="missing" text="Faltan ingredientes" />
                          )}
                        </div>
                     </div>
                     <div className="w-24 h-24 rounded-[18px] overflow-hidden border-2 border-text-main shrink-0 bg-surface flex items-center justify-center text-4xl shadow-[2px_2px_0_0_var(--color-text-main)]">
                        {nextMeal.icon || '🍽️'}
                     </div>
                  </div>
               );
            })()}

            {/* Progress */}
            <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2.5">
               <span className="text-primary-100">Progreso del día</span>
               <span className={getTextColor(todayMenu?.themeColor)}>0/5 comidas</span>
            </div>
            <div className="h-4 w-full bg-primary-900/50 rounded-full overflow-hidden border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] p-0.5">
               <div className={`h-full ${getMenuColors(todayMenu?.themeColor).bg} rounded-full w-[20%] border-r-2 border-text-main`}></div>
            </div>
         </div>
      </section>

      {/* Weekly Widget */}
      <section className="bg-surface border-2 border-text-main rounded-[28px] p-6 shadow-[6px_6px_0_0_var(--color-text-main)] transition-transform hover:-translate-y-1">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Semana Actual</h3>
            <button onClick={() => onNavigate?.('plan')} className="text-[10px] font-black text-primary-900 uppercase tracking-widest hover:underline">Ver Plan Completo</button>
         </div>
         <div className="flex justify-between items-center">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
               <div key={i} onClick={() => onNavigate?.('plan')} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all ${i === todayIndex ? 'bg-primary-900 border-text-main text-surface shadow-[2px_2px_0_0_var(--color-text-main)] group-hover:-translate-y-0.5' : 'bg-transparent border-transparent text-text-secondary group-hover:bg-slate-100'}`}>
                     <span className={`font-black text-sm md:text-base ${i === todayIndex ? 'text-surface' : 'text-text-main'}`}>{day}</span>
                  </div>
                  <div className="flex gap-0.5">
                     <span className={`text-[6px] ${i < 4 ? 'text-text-main' : 'text-border-subtle'}`}>●</span>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Missing Alert - Readiness UI */}
      {hasMissingAlert && (
      <section className="bg-accent-100 rounded-[28px] p-6 border-2 border-text-main shadow-[6px_6px_0_0_var(--color-text-main)] flex flex-col gap-5 transition-transform hover:-translate-y-1">
         <div>
            <h3 className="text-text-main font-black text-lg uppercase tracking-tight flex items-center gap-2 mb-4">
               <span className="text-2xl">⚠️</span> Faltan {missingCount} alimento{missingCount !== 1 ? 's' : ''}
            </h3>
            
            {/* Readiness Icons */}
            <div className="flex gap-4 mb-4 items-center justify-between bg-surface p-4 rounded-[20px] border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] overflow-x-auto custom-scrollbar">
               
               {readyIngredients.slice(0, 2).map((ing: any, idx: number) => (
                   <div key={'ready-'+idx} className="flex flex-col items-center gap-1 shrink-0">
                      <span className="text-2xl">{ing.icon}</span>
                      <span className="text-green-600 font-black">✓</span>
                   </div>
               ))}
               
               {missingIngredients.slice(0, 2).map((ing: any, idx: number) => (
                   <div key={'miss-'+idx} className="flex flex-col items-center gap-1 shrink-0">
                      <span className="text-2xl opacity-50">{ing.icon}</span>
                      <span className="text-red-500 font-black text-lg">!</span>
                   </div>
               ))}

               <div className="flex flex-col items-center justify-center pl-4 ml-auto border-l-2 border-text-main/10 shrink-0">
                  <span className="font-black text-lg text-text-main">{readyCount}/{totalCount}</span>
                  <span className="text-[9px] uppercase font-bold text-text-secondary">Listos</span>
               </div>
            </div>
            
            <p className="text-xs font-bold text-text-secondary">Revisa qué necesitas comprar o descubre por qué puedes sustituirlos.</p>
         </div>
         <button onClick={() => onNavigate?.('equivalencias')} className="bg-surface border-2 border-text-main rounded-full px-6 py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 neo-btn w-full mt-2 hover:bg-slate-50 text-text-main">
            Resolver faltantes <ArrowRight size={16} />
         </button>
      </section>
      )}

      {/* Meals List */}
      <section className="mt-2">
         <div className="flex justify-between items-end mb-4 px-2">
            <div>
               <h3 className="text-[10px] font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] uppercase tracking-widest mb-1">Comidas de Hoy</h3>
               <p className="text-xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight uppercase">{todayMenu?.title || "Sin menú asignado"}</p>
            </div>
         </div>
         <div className="space-y-4">
            {!todayMenu || !todayMenu.meals || todayMenu.meals.length === 0 ? (
              <div className="bg-surface border-2 border-dashed border-text-main rounded-[24px] p-8 text-center">
                <p className="text-sm font-bold text-text-secondary">No hay comidas planeadas para hoy.</p>
              </div>
            ) : null}
            {todayMenu?.meals?.map((meal: any) => {
               const isExpanded = expandedMeals.includes(meal.id);
               const isAvailable = meal.status === 'available';
               const isPartial = meal.status === 'partial';
               return (
               <div key={meal.id} className="bg-surface rounded-[24px] border-2 border-text-main shadow-[6px_6px_0_0_var(--color-text-main)] transition-all overflow-hidden flex flex-col mb-2">
                  <button onClick={() => toggleMeal(meal.id)} className={`p-4 flex items-center justify-between w-full transition-colors text-left ${getMenuColors(todayMenu?.themeColor).bg} ${getMenuColors(todayMenu?.themeColor).text} border-b-2 border-text-main`}>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] flex items-center justify-center text-xl shrink-0">
                           {meal.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <p className="text-[11px] font-black uppercase tracking-widest">{meal.type}</p>
                              <span className="text-[9px] font-black uppercase tracking-widest text-text-main bg-surface px-2 py-0.5 rounded-full border-2 border-text-main">{meal.time}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm truncate">{meal.name}</h4>
                              <div className={`w-2 h-2 rounded-full shrink-0 border border-text-main ${isAvailable ? 'bg-green-500' : isPartial ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                           </div>
                        </div>
                     </div>
                     <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExpanded && (
                     <div className={`p-4 border-t-2 border-text-main transition-all duration-300 ${getMenuColors(todayMenu?.themeColor).lightBg}`}>
                        <h5 className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-3">Alimentos</h5>
                        <div className="space-y-3 mb-4">
                           {meal.ingredients?.map((ing: any, i: number) => (
                              <button key={i} onClick={(e) => { e.stopPropagation(); setSwapTarget({ mealId: meal.id, ingredient: ing }); }} className="w-full flex justify-between items-center bg-surface p-3 rounded-[16px] border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-text-main)] transition-all">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-background border border-border-subtle flex items-center justify-center shrink-0">
                                         <span className="text-sm">{ing.icon || '🥑'}</span>
                                     </div>
                                     <span className="text-xs font-black text-text-main">{ing.name}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <span className="text-[9px] font-black uppercase tracking-widest text-text-main bg-[#fde047] px-2 py-1 rounded-full border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">{ing.qty}</span>
                                     <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center text-accent-700">
                                         <RefreshCcw size={12} />
                                     </div>
                                 </div>
                              </button>
                           ))}
                        </div>
                        <button onClick={() => setActiveMealTracker(meal)} className="w-full bg-accent-500 text-text-main border-2 border-text-main rounded-xl px-4 py-3 font-black text-xs uppercase tracking-widest neo-btn hover:bg-accent-400 shadow-[2px_2px_0_0_var(--color-text-main)] transition-colors">
                           Registrar Consumo
                        </button>
                     </div>
                  )}
               </div>
               );
            })}
         </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-2">
         <h3 className="text-[10px] font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] uppercase tracking-widest mb-4 px-2">Acciones Rápidas</h3>
         <div className="grid grid-cols-2 gap-3 md:gap-4">
            <QuickAction icon={<Calendar />} label="Planear" color="bg-accent-500" onClick={() => onNavigate?.('plan')} />
            <QuickAction icon={<RefreshCcw />} label="Inventario" color="bg-accent-500" onClick={() => onNavigate?.('inventario')} />
            <QuickAction icon={<ShoppingCart />} label="Compras" color="bg-accent-500" onClick={() => onNavigate?.('compras')} />
            <QuickAction icon={<LayoutGrid />} label="Equivalencias" color="bg-accent-500" onClick={() => onNavigate?.('equivalencias')} />
         </div>
      </section>
      {/* Equivalences Swap Modal */}
      {swapTarget && (
         <EquivalenceSwapModal 
            ingredient={swapTarget.ingredient}
            onClose={() => setSwapTarget(null)}
            onSwap={handleSwapIngredient}
         />
      )}
      
      {activeMealTracker && (
         <ConsumptionTracker 
            meal={activeMealTracker} 
            onClose={() => setActiveMealTracker(null)} 
            onSave={(items) => { saveConsumption(activeMealTracker.id, items); setActiveMealTracker(null); }} 
         />
      )}
    </div>
  );
}

function QuickAction({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void }) {
  return (
     <button onClick={onClick} className={`${color} border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] active:shadow-[0_0_0_0_var(--color-text-main)] active:translate-y-1 hover:bg-[#a3e635] p-4 md:p-6 rounded-[24px] flex flex-col items-center justify-center gap-3 transition-all cursor-pointer w-full`}>
        <div className="text-primary-900 bg-surface w-12 h-12 rounded-full flex items-center justify-center border-2 border-text-main shadow-sm">{icon}</div>
        <span className="font-black text-[10px] uppercase tracking-widest text-text-main">{label}</span>
     </button>
  )
}

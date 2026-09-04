const fs = require('fs');
const path = './src/components/HomeView.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("const [activeMealTracker, setActiveMealTracker] = useState<any>(null);",
`const [activeMealTracker, setActiveMealTracker] = useState<any>(null);
  const [expandedMeals, setExpandedMeals] = useState<string[]>([]);

  const toggleMeal = (mealId: string) => {
    setExpandedMeals(prev => prev.includes(mealId) ? prev.filter(id => id !== mealId) : [...prev, mealId]);
  };
`);

content = content.replace("import { Bell, ArrowRight, Calendar, LayoutGrid, ShoppingCart, RefreshCcw } from 'lucide-react';",
"import { Bell, ArrowRight, Calendar, LayoutGrid, ShoppingCart, RefreshCcw, ChevronDown } from 'lucide-react';");

const newMealsList = `<div className="space-y-4">
            {todayMenu.meals.map((meal: any) => {
               const isExpanded = expandedMeals.includes(meal.id);
               const isAvailable = meal.status === 'available';
               const isPartial = meal.status === 'partial';
               return (
               <div key={meal.id} className="bg-surface rounded-[24px] border-2 border-border-subtle transition-all overflow-hidden flex flex-col">
                  <button onClick={() => toggleMeal(meal.id)} className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors text-left">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-xl shrink-0 border border-border-subtle">
                           {meal.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <p className="text-[11px] font-black text-text-main uppercase tracking-widest">{meal.type}</p>
                              <span className="text-[9px] font-bold text-text-secondary bg-background px-1.5 py-0.5 rounded-full border border-border-subtle">{meal.time}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-text-main truncate">{meal.name}</h4>
                              <div className={\`w-2 h-2 rounded-full shrink-0 \${isAvailable ? 'bg-green-500' : isPartial ? 'bg-yellow-500' : 'bg-red-500'}\`}></div>
                           </div>
                        </div>
                     </div>
                     <ChevronDown size={20} className={\`text-text-secondary transition-transform duration-300 \${isExpanded ? 'rotate-180' : ''}\`} />
                  </button>
                  
                  {isExpanded && (
                     <div className="p-4 border-t-2 border-border-subtle bg-background transition-all duration-300">
                        <h5 className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-3">Alimentos</h5>
                        <div className="space-y-2 mb-4">
                           {meal.ingredients?.map((ing: any, i: number) => (
                              <div key={i} className="flex justify-between items-center bg-surface p-2 rounded-[12px] border border-border-subtle">
                                 <span className="text-xs font-bold flex items-center gap-2"><span className="text-base">{ing.icon}</span> {ing.name}</span>
                                 <span className="text-[10px] font-black text-text-secondary bg-background px-2 py-1 rounded-full">{ing.qty}</span>
                              </div>
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
         </div>`;

content = content.replace(/<div className="space-y-3">\s*\{todayMenu\.meals\.map[^]+?<\/div>\s*<\/section>/, newMealsList + '\n      </section>');

fs.writeFileSync(path, content, 'utf8');

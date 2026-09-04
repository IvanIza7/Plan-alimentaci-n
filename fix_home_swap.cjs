const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

// Add import for modal
code = code.replace("import { getNutritionalSummary } from '../data/equivalences';", "import { getNutritionalSummary } from '../data/equivalences';\nimport EquivalenceSwapModal from './EquivalenceSwapModal';");

// Add updateMenu
code = code.replace("const { menus, activeMenus, seedData } = useAppData();", "const { menus, activeMenus, seedData, updateMenu } = useAppData();");

// Add state for swap modal
const stateTarget = `const [expandedMeals, setExpandedMeals] = useState<string[]>([]);`;
const stateReplacement = `const [expandedMeals, setExpandedMeals] = useState<string[]>([]);
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
  };`;
code = code.replace(stateTarget, stateReplacement);

// Find ingredients rendering and replace to make it clickable neo-brutalist style
const ingredientsTarget = `<div className="space-y-2 mb-4">
                           {meal.ingredients?.map((ing: any, i: number) => (
                              <div key={i} className="flex justify-between items-center bg-surface p-2 rounded-[12px] border border-border-subtle">
                                 <span className="text-xs font-bold flex items-center gap-2"><span className="text-base">{ing.icon}</span> {ing.name}</span>
                                 <span className="text-[10px] font-black text-text-secondary bg-background px-2 py-1 rounded-full">{ing.qty}</span>
                              </div>
                           ))}
                        </div>`;

const ingredientsReplacement = `<div className="space-y-3 mb-4">
                           {meal.ingredients?.map((ing: any, i: number) => (
                              <button key={i} onClick={(e) => { e.stopPropagation(); setSwapTarget({ mealId: meal.id, ingredient: ing }); }} className="w-full flex justify-between items-center bg-surface p-3 rounded-[16px] border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-text-main)] transition-all">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-background border border-border-subtle flex items-center justify-center shrink-0">
                                         <span className="text-sm">{ing.icon || '🥑'}</span>
                                     </div>
                                     <span className="text-xs font-black text-text-main">{ing.name}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary bg-background px-2 py-1 rounded-full border border-border-subtle">{ing.qty}</span>
                                     <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center text-accent-700">
                                         <RefreshCcw size={12} />
                                     </div>
                                 </div>
                              </button>
                           ))}
                        </div>`;

code = code.replace(ingredientsTarget, ingredientsReplacement);

// Add the modal component at the end of the return statement
const returnEndTarget = `   </section>
      
      {/* Modals */}`;
const returnEndReplacement = `   </section>

      {/* Equivalences Swap Modal */}
      {swapTarget && (
         <EquivalenceSwapModal 
            ingredient={swapTarget.ingredient}
            onClose={() => setSwapTarget(null)}
            onSwap={handleSwapIngredient}
         />
      )}
      
      {/* Modals */}`;
code = code.replace(returnEndTarget, returnEndReplacement);

fs.writeFileSync('src/components/HomeView.tsx', code, 'utf-8');

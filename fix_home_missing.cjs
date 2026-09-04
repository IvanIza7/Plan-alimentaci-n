const fs = require('fs');

let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

// 1. Calculate missing items dynamically
const insertionPoint = "return (\n    <div";
const calculationLogic = `  const allIngredients = todayMenu?.meals?.flatMap((m: any) => m.ingredients || []) || [];
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

  `;
code = code.replace(insertionPoint, calculationLogic + insertionPoint);

// 2. Replace the Missing Alert section
const sectionRegex = /\{\/\* Missing Alert - Readiness UI \*\/\}([\s\S]*?)<\/section>/;

const newSection = `{/* Missing Alert - Readiness UI */}
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
      )}`;

code = code.replace(sectionRegex, newSection);

fs.writeFileSync('src/components/HomeView.tsx', code, 'utf-8');
console.log("Missing alert logic updated.");

const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

// Fix No Menu card
const noMenuTarget = `<div className="bg-black/20 backdrop-blur-md rounded-[24px] p-4 flex gap-4 items-center border border-white/10 shadow-sm">
                        <div className="flex-1">
                           <p className="text-[9px] font-bold uppercase tracking-widest text-primary-300 mb-1">No hay menú</p>
                           <h3 className="font-display font-black text-xl uppercase mb-1">Día Libre</h3>
                           <p className="text-[11px] text-primary-100 mb-3 opacity-90 font-medium">Asigna un menú desde el plan.</p>
                        </div>
                     </div>`;
                     
const noMenuReplacement = `<div className="bg-[#fde047] text-text-main rounded-[24px] p-4 flex gap-4 items-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)]">
                        <div className="flex-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">No hay menú</p>
                           <h3 className="font-display font-black text-xl uppercase mb-1">Día Libre</h3>
                           <p className="text-[11px] font-bold">Asigna un menú desde el plan.</p>
                        </div>
                     </div>`;
code = code.replace(noMenuTarget, noMenuReplacement);

// Fix Next Meal card
const nextMealTarget = `<div className="bg-black/20 backdrop-blur-md rounded-[24px] p-4 flex gap-4 items-center border border-white/10 shadow-sm cursor-pointer hover:bg-black/30 transition-all" onClick={() => onNavigate?.('plan')}>
                     <div className="flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-primary-300 mb-1">Próxima Comida ({nextMeal.time})</p>
                        <h3 className="font-display font-black text-xl uppercase mb-1">{nextMeal.type}</h3>
                        <p className="text-[11px] text-primary-100 mb-3 opacity-90 font-medium line-clamp-1">{nextMeal.name}</p>
                        <div className="flex items-center gap-2">
                          {nextMeal.ingredients && nextMeal.ingredients.every(i => i.ready) ? (
                            <StatusBadge status="available" text="Ingredientes listos" />
                          ) : (
                            <StatusBadge status="missing" text="Faltan ingredientes" />
                          )}
                        </div>
                     </div>
                     <div className="w-24 h-24 rounded-[18px] overflow-hidden border-2 border-primary-900 shrink-0 bg-surface flex items-center justify-center text-4xl shadow-inner">
                        {nextMeal.icon || '🍽️'}
                     </div>
                  </div>`;
                  
const nextMealReplacement = `<div className="bg-[#fde047] text-text-main rounded-[24px] p-4 flex gap-4 items-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-text-main)] transition-all" onClick={() => onNavigate?.('plan')}>
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
                  </div>`;
code = code.replace(nextMealTarget, nextMealReplacement);

fs.writeFileSync('src/components/HomeView.tsx', code, 'utf-8');

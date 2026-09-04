const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const target = `              <div className="flex flex-col gap-4">
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
                    {currentMenu.meals.map((meal) => {`;

const replacement = `              <div className="flex flex-col gap-4">
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
                       {currentMenu.meals.map((meal: any) => {`;

code = code.replace(target, replacement);

const target2 = `                       );
                    })}
                 </div>
              </div>`;

const replacement2 = `                       );
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
              </div>`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const returnEnd = `           {/* FAB Edit Menu inside Selected Menu View */}
           <div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-[60]">
              <button onClick={() => setShowMenuEditor(true)} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">
                 <Edit3 size={24} />
              </button>
           </div>
           </div>
        </div>
     );
  }`;

const newReturnEnd = `           {/* FAB Edit Menu inside Selected Menu View */}
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
                          meals: JSON.stringify(updates.meals)
                       });
                    }
                    setShowMenuEditor(false);
                 }}
              />
           )}
           
           </div>
        </div>
     );
  }`;

code = code.replace(returnEnd, newReturnEnd);
fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

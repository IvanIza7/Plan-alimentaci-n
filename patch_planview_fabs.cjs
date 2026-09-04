const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// 1. Add state variables
code = code.replace(
  "const [showMenuEditor, setShowMenuEditor] = useState(false);",
  `const [showMenuEditor, setShowMenuEditor] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());`
);

// 2. Add imports if needed. We need Plus, Trash2, Check from lucide-react. Let's check what's imported.
// ArrowRight, AlertTriangle, ArrowLeft, X, Edit3.
code = code.replace(
  "import { ArrowRight, AlertTriangle, ArrowLeft, X, Edit3 } from 'lucide-react';",
  "import { ArrowRight, AlertTriangle, ArrowLeft, X, Edit3, Plus, Trash2, Check } from 'lucide-react';"
);

// 3. Modify the grid item
const oldGridItem = `<div key={menu.id} onClick={() => setSelectedMenuId(menu.id)} className="bg-surface border-2 border-text-main rounded-[24px] overflow-hidden neo-card flex flex-col cursor-pointer hover:shadow-[6px_6px_0_0_var(--color-text-main)] hover:-translate-y-1 transition-all">`;
const newGridItem = `<div key={menu.id} onClick={() => {
                     if (selectionMode) {
                        const newSet = new Set(selectedForDeletion);
                        if (newSet.has(menu.id)) newSet.delete(menu.id);
                        else newSet.add(menu.id);
                        setSelectedForDeletion(newSet);
                     } else {
                        setSelectedMenuId(menu.id);
                     }
                  }} className={\`relative bg-surface border-2 \${selectionMode && selectedForDeletion.has(menu.id) ? 'border-red-500 shadow-[6px_6px_0_0_#ef4444] -translate-y-1' : 'border-text-main hover:shadow-[6px_6px_0_0_var(--color-text-main)] hover:-translate-y-1'} rounded-[24px] overflow-hidden neo-card flex flex-col cursor-pointer transition-all\`}>
                     {selectionMode && (
                        <div className={\`absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-text-main flex items-center justify-center z-10 \${selectedForDeletion.has(menu.id) ? 'bg-red-500 text-white' : 'bg-surface'}\`}>
                           {selectedForDeletion.has(menu.id) && <Check size={14} />}
                        </div>
                     )}`;

code = code.replace(oldGridItem, newGridItem);

// 4. Add the FABs
const endOfMenusView = `           </div>
           </>
        )}
`;

const fabsCode = `           </div>
           
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
                          if (selectedForDeletion.size > 0 && window.confirm(\`¿Eliminar \${selectedForDeletion.size} menú(s)?\`)) {
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
`;

code = code.replace(endOfMenusView, fabsCode);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');
console.log("Patched PlanView FABs");

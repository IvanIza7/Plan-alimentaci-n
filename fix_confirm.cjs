const fs = require('fs');

let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

// Add a state for showing the delete confirmation
code = code.replace(
  "const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);",
  "const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);\n  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);"
);

// Replace the delete button logic
code = code.replace(
  /<button onClick=\{\(\) => \{ if\(window.confirm\('¿Estás seguro de que quieres eliminar este menú permanentemente\?'\)\) onDelete\(\); \}\} className="w-full bg-red-100 border-2 border-text-main text-red-600 font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1 shadow-\[4px_4px_0_0_var\(--color-text-main\)\] hover:bg-red-500 hover:text-white transition-all mt-6 mb-4 neo-btn">\s*Eliminar Menú <Trash2 size=\{18\} \/>\s*<\/button>/m,
  `
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
  `
);

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');
console.log("Fixed window.confirm issue in MenuEditorModal");

const fs = require('fs');

let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

// Replace top header
code = code.replace(
  /<div className="flex justify-between items-center mb-6">[\s\S]*?<\/div>\s*<div className="mb-6">/m,
  `<div className="mb-6">
            <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-text-main">Editar Menú</h3>
          </div>
          
          <div className="mb-6">`
);

// Replace bottom button area
code = code.replace(
  /<button onClick=\{\(\) => onSave\(\{ title, meals, coverImage \}\)\} className="w-full bg-accent-500 border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1 shadow-\[4px_4px_0_0_var\(--color-text-main\)\] hover:bg-accent-400 transition-all mt-6 neo-btn">\s*Guardar Cambios <ArrowRight size=\{18\} \/>\s*<\/button>/m,
  `{onDelete && (
             <button onClick={() => { if(window.confirm('¿Estás seguro de que quieres eliminar este menú permanentemente?')) onDelete(); }} className="w-full bg-red-100 border-2 border-text-main text-red-600 font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-red-500 hover:text-white transition-all mt-6 mb-4 neo-btn">
               Eliminar Menú <Trash2 size={18} />
             </button>
          )}
          <button onClick={() => onSave({ title, meals, coverImage })} className="w-full bg-accent-500 border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-accent-400 transition-all neo-btn">
            Guardar Cambios <ArrowRight size={18} />
          </button>`
);

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');
console.log("Moved delete button in MenuEditorModal.tsx");

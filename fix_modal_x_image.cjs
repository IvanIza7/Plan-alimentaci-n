const fs = require('fs');
let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

// 1. Fix the top header to include the 'X' button
code = code.replace(
  /<div className="mb-6">\s*<h3 className="font-display font-black text-2xl uppercase tracking-tighter text-text-main">Editar Menú<\/h3>\s*<\/div>/m,
  `<div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-text-main">Editar Menú</h3>
            <button onClick={onClose} className="w-10 h-10 rounded-full border-2 border-text-main flex items-center justify-center neo-btn bg-surface hover:bg-slate-100 shrink-0">
               <X size={20} />
            </button>
          </div>`
);

// 2. Add an input field for custom image URL/path below the preset images
code = code.replace(
  /className=\{\`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition-all \$\{coverImage === img \? 'border-primary-900 shadow-\[4px_4px_0_0_var\(--color-primary-900\)\] scale-110' : 'border-transparent hover:border-text-main'\}\`\}\s*\/>\s*\)\)\}\s*<\/div>/m,
  `className={\`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition-all \${coverImage === img ? 'border-primary-900 shadow-[4px_4px_0_0_var(--color-primary-900)] scale-110' : 'border-transparent hover:border-text-main'}\`}
                   />
                ))}
             </div>
             <div className="mt-3">
                <input 
                   type="text" 
                   placeholder="Pega aquí la URL de tu imagen o ruta local (ej. /foto.jpg)" 
                   value={coverImage} 
                   onChange={e => setCoverImage(e.target.value)} 
                   className="w-full bg-surface border-2 border-text-main rounded-xl p-3 text-sm font-bold text-text-main focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] shadow-[4px_4px_0_0_var(--color-text-main)] transition-all"
                />
             </div>`
);

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');
console.log("Fixed MenuEditorModal");

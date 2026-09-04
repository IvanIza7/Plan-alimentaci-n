const fs = require('fs');

let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

const IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
  "https://images.unsplash.com/photo-149883716733f-a5189f104c21?w=400&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80"
];

const uiToInsert = `
          {/* Header Title with Delete */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-text-main">Editar Menú</h3>
            {onDelete && (
               <button onClick={() => { if(window.confirm('¿Estás seguro de que quieres eliminar este menú?')) onDelete(); }} className="w-10 h-10 rounded-full bg-red-100 border-2 border-text-main flex items-center justify-center text-red-600 hover:bg-red-500 hover:text-white shadow-[2px_2px_0_0_var(--color-text-main)] transition-colors">
                  <Trash2 size={18} />
               </button>
            )}
          </div>
          
          <div className="mb-6">
             <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Nombre del menú</label>
             <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full bg-background border-2 border-text-main rounded-xl p-4 font-bold text-text-main focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] shadow-[4px_4px_0_0_var(--color-text-main)] transition-all"
             />
          </div>

          <div className="mb-6">
             <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Portada del menú</label>
             <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {${JSON.stringify(IMAGES)}.map(img => (
                   <img 
                      key={img}
                      src={img}
                      alt="Cover option"
                      onClick={() => setCoverImage(img)}
                      className={\`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition-all \${coverImage === img ? 'border-primary-900 shadow-[4px_4px_0_0_var(--color-primary-900)] scale-110' : 'border-transparent hover:border-text-main'}\`}
                   />
                ))}
             </div>
          </div>
`;

code = code.replace(
  /<div>\s*<label className="block text-\[10px\] font-black uppercase tracking-widest text-text-secondary mb-2">Nombre del Menú<\/label>[\s\S]*?<\/div>/,
  uiToInsert
);

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');
console.log("Patched MenuEditorModal.tsx again");

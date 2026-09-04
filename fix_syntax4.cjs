const fs = require('fs');
let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

// I am just going to overwrite the end of the file starting from `{onDelete && (`
const startIdx = code.indexOf('{onDelete && (');
if(startIdx !== -1) {
  const newEnd = `{onDelete && (
             <div className="w-full">
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
             </div>
          )}
          <button onClick={() => onSave({ title, meals, coverImage })} className="w-full bg-accent-500 border-2 border-text-main text-text-main font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-accent-400 transition-all neo-btn">
            Guardar Cambios <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}`;
  code = code.substring(0, startIdx) + newEnd;
  fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');
  console.log("Fixed syntax completely");
}

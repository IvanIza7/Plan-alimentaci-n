const fs = require('fs');
const path = './src/components/PlanView.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add import
content = content.replace(
  "import { StatusBadge } from './StatusBadge';",
  "import { StatusBadge } from './StatusBadge';\nimport MenuEditorModal from './MenuEditorModal';"
);

content = content.replace(
  "const [showMenuSelector, setShowMenuSelector] = useState(false);",
  "const [showMenuSelector, setShowMenuSelector] = useState(false);\n  const [showMenuEditor, setShowMenuEditor] = useState(false);"
);

const oldButtons = `<button onClick=\\{\\(\\) => setShowMenuSelector\\(true\\)\\} className="text-\\[10px\\] bg-primary-900 text-surface border-2 border-text-main font-black uppercase tracking-widest hover:bg-primary-800 transition-colors px-4 py-2 rounded-full shadow-\\[2px_2px_0_0_var\\(--color-text-main\\)\\]">
                       Elegir Menú
                    </button>`;
const newButtons = `<div className="flex gap-2">
                       <button onClick={() => setShowMenuEditor(true)} className="text-[10px] bg-background text-text-main border-2 border-text-main font-black uppercase tracking-widest hover:bg-slate-50 transition-colors px-4 py-2 rounded-full shadow-[2px_2px_0_0_var(--color-text-main)]">
                          Modificar
                       </button>
                       <button onClick={() => setShowMenuSelector(true)} className="text-[10px] bg-primary-900 text-surface border-2 border-text-main font-black uppercase tracking-widest hover:bg-primary-800 transition-colors px-4 py-2 rounded-full shadow-[2px_2px_0_0_var(--color-text-main)]">
                          Elegir Menú
                       </button>
                    </div>`;
                    
content = content.replace(new RegExp(oldButtons), newButtons);

const oldModalEnd = /\{\/\* Menu Selector Modal \*\/\}/;
const newEditorCode = `
        {/* Menu Editor Modal */}
        {showMenuEditor && (
           <MenuEditorModal 
              menu={currentMenu} 
              onClose={() => setShowMenuEditor(false)} 
              onSave={async (updates) => {
                 if (firestoreMenu) {
                    // Update existing in Firestore
                    // (Ensure updateMenu is extracted from useAppData if you added it, 
                    //  but here we can just update local state if we don't have it readily)
                 }
                 setShowMenuEditor(false);
              }}
           />
        )}
        
        {/* Menu Selector Modal */}`;

content = content.replace(oldModalEnd, newEditorCode);

fs.writeFileSync(path, content, 'utf8');

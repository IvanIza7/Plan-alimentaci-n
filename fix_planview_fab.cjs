const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// Remove the FAB from if (selectedMenuId)
code = code.replace(/\s*\{\/\* FAB Edit Menu \*\/\}\s*<div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-\[60\]">\s*<button onClick=\{\(\) => setShowMenuEditor\(true\)\} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-\[4px_4px_0_0_var\(--color-text-main\)\] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">\s*<Edit3 size=\{24\} \/>\s*<\/button>\s*<\/div>/, "");

// Add FAB to view === 'menus'
const newFab = `
        {/* FAB Modificar Menu */}
        {view === 'menus' && !selectedMenuId && (
           <div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-[60]">
              <button onClick={() => setShowMenuEditor(true)} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">
                 <Edit3 size={24} />
              </button>
           </div>
        )}
`;

code = code.replace(/(<\/\s*div>\s*)\(\s*\)\s*\}\s*<div className="p-4 md:p-6">/, "$1" + newFab + "\n  return (\n    <div className=\"p-4 md:p-6\">");
// Wait, the structure of PlanView is:
/*
  return (
     <div className="flex flex-col gap-8 pb-10">
        <header ...
        {view === 'semana' ? ( ... ) : ( <div className="grid ..."> ... </div> )}
        
        {/* Menu Editor Modal *\/}
        ...
        {/* Menu Selector Modal *\/}
        ...
     </div>
  );
*/
// We can just add the new FAB right before {/* Menu Editor Modal */}
code = code.replace(/\{\/\* Menu Editor Modal \*\/\}/, newFab + "\n        {/* Menu Editor Modal */}");

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

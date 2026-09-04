const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const regex = /<div className="fixed bottom-32 left-0 right-0 flex justify-center pointer-events-none px-6 z-\[60\]">\s*<button className="pointer-events-auto bg-primary-900 text-surface px-8 py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-text-main shadow-\[4px_4px_0_0_var\(--color-text-main\)\] hover:bg-primary-800 transition-all hover:-translate-y-1">\s*Modificar Menú\s*<\/button>\s*\{\/\* FAB Edit Menu \*\/\}\s*<div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-\[60\]">\s*<button onClick=\{\(\) => setShowMenuEditor\(true\)\} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-\[4px_4px_0_0_var\(--color-text-main\)\] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">\s*<Edit3 size=\{24\} \/>\s*<\/button>\s*<\/div>\s*<\/div>/;

const replacement = `
           {/* FAB Edit Menu */}
           <div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-[60]">
              <button onClick={() => setShowMenuEditor(true)} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">
                 <Edit3 size={24} />
              </button>
           </div>
`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

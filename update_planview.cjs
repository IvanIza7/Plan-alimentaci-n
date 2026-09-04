const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// Remove FAB from selectedMenuId
code = code.replace(/\{\/\* FAB Edit Menu \*\/\}\s*<div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-\[60\]">\s*<button onClick=\{\(\) => setShowMenuEditor\(true\)\} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-\[4px_4px_0_0_var\(--color-text-main\)\] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">\s*<Edit3 size=\{24\} \/>\s*<\/button>\s*<\/div>/, "");

// We have two potential places: view === 'menus' and showMenuSelector modal.
// The prompt says "vista de selección de menús". I think they mean the modal that pops up when you click "Elegir Menú".
// Let's put the FAB in the showMenuSelector modal.
// Wait, if it's in the modal, it will float over the modal.
// Modal is:
/*
        {showMenuSelector && (
           <div className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
              <div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md neo-card shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)] max-h-[85vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-6 sticky top-0 bg-surface z-10 py-2">
*/

const fs = require('fs');

let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

// Fix Progress Bar
const progressTarget = `<div className="mt-8 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest mb-2.5">
               <span className="text-primary-100">Progreso del día</span>
               <span className="text-accent-500">0/5 comidas</span>
            </div>
            <div className="h-3.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
               <div className="h-full bg-surface rounded-full w-[20%]"></div>
            </div>`;

const progressReplacement = `<div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2.5">
               <span className="text-primary-100">Progreso del día</span>
               <span className="text-[#fde047]">0/5 comidas</span>
            </div>
            <div className="h-4 w-full bg-primary-900/50 rounded-full overflow-hidden border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] p-0.5">
               <div className="h-full bg-[#fde047] rounded-full w-[20%] border-r-2 border-text-main"></div>
            </div>`;

code = code.replace(progressTarget, progressReplacement);

// Fix Missing items icon container
const missingIconsTarget = `<div className="flex gap-4 mb-4 items-center justify-between bg-surface/50 p-4 rounded-[20px] border-2 border-text-main/10">`;
const missingIconsReplacement = `<div className="flex gap-4 mb-4 items-center justify-between bg-surface p-4 rounded-[20px] border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)]">`;
code = code.replace(missingIconsTarget, missingIconsReplacement);

// Fix meals list cards container
const mealCardTarget = `<div key={meal.id} className="bg-surface rounded-[24px] border-2 border-border-subtle transition-all overflow-hidden flex flex-col">`;
const mealCardReplacement = `<div key={meal.id} className="bg-surface rounded-[24px] border-2 border-text-main shadow-[6px_6px_0_0_var(--color-text-main)] transition-all overflow-hidden flex flex-col mb-2">`;
code = code.replace(mealCardTarget, mealCardReplacement);

// Fix inner border of meal card when expanded
const mealExpandedTarget = `<div className="p-4 border-t-2 border-border-subtle bg-background transition-all duration-300">`;
const mealExpandedReplacement = `<div className="p-4 border-t-2 border-text-main bg-background transition-all duration-300">`;
code = code.replace(mealExpandedTarget, mealExpandedReplacement);

fs.writeFileSync('src/components/HomeView.tsx', code, 'utf-8');

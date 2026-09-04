const fs = require('fs');
let code = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');

const targetCards = `<div className="bg-green-100 border-2 border-green-500 text-green-700 rounded-[20px] p-3 flex flex-col items-center justify-center">
            <span className="text-xl sm:text-2xl font-black">{sufficient}</span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mt-1">Bien</span>
         </div>
         <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-700 rounded-[20px] p-3 flex flex-col items-center justify-center">
            <span className="text-xl sm:text-2xl font-black">{partial}</span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mt-1">Poco</span>
         </div>
         <div className="bg-red-100 border-2 border-red-500 text-red-700 rounded-[20px] p-3 flex flex-col items-center justify-center">
            <span className="text-xl sm:text-2xl font-black">{missing}</span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mt-1">Falta</span>
         </div>`;

const newCards = `<div className="bg-[#4ade80] border-2 border-text-main text-text-main rounded-[20px] p-3 flex flex-col items-center justify-center neo-card shadow-[3px_3px_0_0_var(--color-text-main)]">
            <span className="text-xl sm:text-2xl font-black">{sufficient}</span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mt-1">Bien</span>
         </div>
         <div className="bg-[#fde047] border-2 border-text-main text-text-main rounded-[20px] p-3 flex flex-col items-center justify-center neo-card shadow-[3px_3px_0_0_var(--color-text-main)]">
            <span className="text-xl sm:text-2xl font-black">{partial}</span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mt-1">Poco</span>
         </div>
         <div className="bg-[#ef4444] border-2 border-text-main text-text-main rounded-[20px] p-3 flex flex-col items-center justify-center neo-card shadow-[3px_3px_0_0_var(--color-text-main)]">
            <span className="text-xl sm:text-2xl font-black">{missing}</span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mt-1">Falta</span>
         </div>`;

code = code.replace(targetCards, newCards);
code = code.replace('<div className="grid grid-cols-2 md:grid-cols-3 gap-4">', '<div className="grid grid-cols-3 gap-2 sm:gap-4">');

fs.writeFileSync('src/components/InventoryView.tsx', code, 'utf-8');

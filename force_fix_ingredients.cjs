const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// I'll use regex to remove the entire ready logic block
const targetRegex = /\{\/\* Grid for Ingredients \*\/\}\s*<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">[\s\S]*?\{ing\.ready \? '✓ Listo' : '○ Falta'\}\s*<\/div>\s*<\/div>\s*\)\)\}\s*<\/div>\s*\{\/\* Readiness Bar \*\/\}\s*<div className="border-t-2 border-border-subtle pt-4">[\s\S]*?<\/div>\s*<\/div>/g;

const replacement = `{/* Grid for Ingredients */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                   {meal.ingredients?.map((ing, idx) => (
                                      <div key={idx} className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-2 p-3 bg-background border-2 border-border-subtle rounded-[16px] hover:border-text-main transition-colors">
                                         <div className="text-2xl sm:text-3xl bg-surface w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-text-main shadow-sm shrink-0">{ing.icon}</div>
                                         <div className="hidden sm:block w-6 h-0.5 bg-border-subtle"></div>
                                         <div className="flex flex-col sm:items-center w-full">
                                            <p className="font-bold text-sm text-text-main leading-tight text-center">{ing.name}</p>
                                            <p className="text-[10px] font-black text-text-secondary uppercase mt-1 text-center">{ing.qty}</p>
                                         </div>
                                      </div>
                                   ))}
                                </div>`;

if (code.match(targetRegex)) {
    code = code.replace(targetRegex, replacement);
    console.log("Regex replacement successful");
} else {
    console.log("Regex didn't match. Manual substring fallback.");
    
    // Manual fallback for the exact code found in grep
    const manualTarget = `<div className="p-4 md:p-6">
                                {/* Grid for Ingredients */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                   {meal.ingredients?.map((ing, idx) => (
                                      <div key={idx} className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-2 p-3 bg-background border-2 border-border-subtle rounded-[16px] hover:border-text-main transition-colors cursor-pointer">
                                         <div className="flex items-center sm:flex-col gap-3 sm:gap-2">
                                            <div className="text-2xl sm:text-3xl bg-surface w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-text-main shadow-sm">{ing.icon}</div>
                                            <div className="hidden sm:block w-6 h-0.5 bg-border-subtle"></div>
                                            <div className="flex flex-col sm:items-center">
                                               <p className="font-bold text-sm text-text-main">{ing.name}</p>
                                               <p className="text-[10px] font-black text-text-secondary uppercase">{ing.qty}</p>
                                            </div>
                                         </div>
                                         <div className={\`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 \${ing.ready ? 'text-green-600' : 'text-red-500'}\`}>
                                            {ing.ready ? '✓ Listo' : '○ Falta'}
                                         </div>
                                      </div>
                                   ))}
                                </div>
                                
                                {/* Readiness Bar */}
                                <div className="border-t-2 border-border-subtle pt-4">
                                   <div className="flex justify-between items-end mb-2">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Ingredientes</span>
                                      <div className="text-right">
                                         <span className="text-sm font-black text-text-main">{readyCount} / {totalCount}</span>
                                         <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary ml-1">Listos</span>
                                      </div>
                                   </div>
                                   <div className="h-2.5 w-full bg-border-subtle rounded-full overflow-hidden border border-border-subtle">
                                      <div className="h-full bg-accent-500 transition-all duration-500" style={{width: \`\${progress}%\`}}></div>
                                   </div>
                                </div>`;
    
    code = code.replace(manualTarget, `<div className="p-4 md:p-6">\n${replacement}`);
}

// Remove the ready logic in the menu viewer modal too
const menuViewerRegex = /<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">[\s\S]*?\{ing\.ready \? '✓ Listo' : '○ Falta'\}\s*<\/div>\s*<\/div>\s*\)\)\}\s*<\/div>\s*<div className="border-t-2 border-border-subtle pt-4">[\s\S]*?<\/div>\s*<\/div>/g;
code = code.replace(menuViewerRegex, replacement);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

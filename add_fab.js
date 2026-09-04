const fs = require('fs');
let content = fs.readFileSync('src/components/ProgressView.tsx', 'utf8');

const fabHtml = `
         {/* FAB */}
         <div className="fixed bottom-24 right-6 flex justify-end pointer-events-none z-[60]">
            <button className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1">
                <Plus size={24} />
            </button>
         </div>
`;

content = content.replace('      </div>\n   );\n}', fabHtml + '      </div>\n   );\n}');
fs.writeFileSync('src/components/ProgressView.tsx', content);

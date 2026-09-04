const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

code = code.replace(
  /<div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-\[32px\] sm:rounded-\[32px\] p-6 w-full max-w-md neo-card shadow-\[0_-8px_0_0_var\(--color-text-main\)\] sm:shadow-\[8px_8px_0_0_var\(--color-text-main\)\] max-h-\[85vh\] overflow-y-auto">/,
  '<div className="bg-surface border-t-2 border-l-2 border-r-2 sm:border-b-2 border-text-main rounded-t-[32px] sm:rounded-[32px] p-6 w-full max-w-md neo-card shadow-[0_-8px_0_0_var(--color-text-main)] sm:shadow-[8px_8px_0_0_var(--color-text-main)] max-h-[85vh] overflow-y-auto relative">'
);

code = code.replace(
  /(\s*)<\/div>\s*<\/div>\s*\)\}\s*<\/div>\s*\);\s*\}/,
  `$1   {/* FAB Editar en Selector */}
$1   <div className="absolute bottom-6 right-6">
$1      <button onClick={() => { setShowMenuSelector(false); setShowMenuEditor(true); }} className="bg-primary-900 text-surface w-12 h-12 rounded-full flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1 transition-all">
$1         <Edit3 size={20} />
$1      </button>
$1   </div>
$1</div>
            </div>
         )}
      </div>
   );
}`
);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

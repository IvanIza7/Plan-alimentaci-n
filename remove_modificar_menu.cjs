const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

code = code.replace(/<div className="fixed bottom-32 left-0 right-0 flex justify-center pointer-events-none px-6 z-\[60\]">\s*<button.*?Modificar Menú\s*<\/button>/g, "");

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

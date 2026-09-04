const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

code = code.replace(
  "const menu = parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu;\n     return (",
  "const menu = parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu;\n     if (!menu) return <div className=\"p-8 text-center\"><button onClick={() => setSelectedMenuId(null)} className=\"neo-btn px-4 py-2 bg-surface border-2 border-text-main rounded-full\">Volver</button></div>;\n     return ("
);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

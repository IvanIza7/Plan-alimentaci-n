const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

code = code.replace(
  `alert("Error: No se pudo eliminar el menú. Por favor recarga e intenta de nuevo.");`,
  `// Alert removed to avoid iframe issues`
);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

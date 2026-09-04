const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');
console.log(code.includes("Falta"));
console.log(code.includes("Listo"));

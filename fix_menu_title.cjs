const fs = require('fs');

let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');
code = code.replace(
  /className="text-2xl font-display font-black text-text-main tracking-tight uppercase">\{menu.title\}/,
  'className="text-2xl font-display font-black text-white drop-shadow-md tracking-tight uppercase">{menu.title}'
);
fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');
console.log("Menu title updated");

const fs = require('fs');

function replaceFile(path) {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf-8');
    // Reemplazamos la sombra ligera por una sombra negra mucho más fuerte y oscura
    code = code.replace(/drop-shadow-md/g, "drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]");
    fs.writeFileSync(path, code, 'utf-8');
  }
}

const screens = [
  'src/components/HomeView.tsx',
  'src/components/PlanView.tsx',
  'src/components/ShoppingView.tsx',
  'src/components/ProgressView.tsx',
  'src/components/InventoryView.tsx',
  'src/components/EquivalencesView.tsx',
  'src/components/ProfileView.tsx'
];

screens.forEach(s => replaceFile(s));

console.log("Strong shadows applied");

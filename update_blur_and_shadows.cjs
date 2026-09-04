const fs = require('fs');

function replaceFile(path, replacer) {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf-8');
    code = replacer(code);
    fs.writeFileSync(path, code, 'utf-8');
  }
}

// 1. Update Background Blur in App.tsx
replaceFile('src/App.tsx', code => {
  return code.replace(/bg-cover bg-center bg-fixed opacity-100 pointer-events-none/g, "bg-cover bg-center bg-fixed pointer-events-none blur-sm scale-105");
});

// 2. Update all text shadows
const screens = [
  'src/components/HomeView.tsx',
  'src/components/PlanView.tsx',
  'src/components/ShoppingView.tsx',
  'src/components/ProgressView.tsx',
  'src/components/InventoryView.tsx',
  'src/components/EquivalencesView.tsx',
  'src/components/ProfileView.tsx'
];

screens.forEach(s => {
  replaceFile(s, code => {
    return code.replace(/drop-shadow-\[0_4px_6px_rgba\(0,0,0,0\.8\)\]/g, "[text-shadow:0_2px_8px_rgba(0,0,0,0.65)]");
  });
});

console.log("Blur and soft shadows applied");

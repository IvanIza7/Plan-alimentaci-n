const fs = require('fs');
const glob = require('glob'); // Not using glob directly to avoid missing dep issues

function replaceFile(path, replacer) {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf-8');
    code = replacer(code);
    fs.writeFileSync(path, code, 'utf-8');
  }
}

const files = [
  'src/components/PlanView.tsx',
  'src/components/ShoppingView.tsx',
  'src/components/ProgressView.tsx',
  'src/components/InventoryView.tsx',
  'src/components/MenuEditorModal.tsx',
  'src/components/ConsumptionTracker.tsx',
  'src/components/EquivalenceSwapModal.tsx',
  'src/components/HomeView.tsx',
  'src/App.tsx'
];

files.forEach(f => {
  replaceFile(f, code => {
    return code
      .replace(/backdrop-blur-sm/g, '')
      .replace(/backdrop-blur-md/g, '')
      .replace(/blur-sm scale-105/g, '')
      .replace(/blur-sm/g, '')
      .replace(/blur-xl/g, '');
  });
});

console.log("Blur effects removed");

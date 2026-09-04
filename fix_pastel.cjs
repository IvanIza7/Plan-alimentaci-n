const fs = require('fs');
const glob = require('glob'); // Note: glob might not be available, fallback to simple array

function replaceFile(path, replacer) {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf-8');
    code = replacer(code);
    fs.writeFileSync(path, code, 'utf-8');
  }
}

const files = [
  'src/components/ShoppingView.tsx',
  'src/components/InventoryView.tsx',
  'src/components/HomeView.tsx',
  'src/components/MenuEditorModal.tsx'
];

files.forEach(f => {
  replaceFile(f, code => {
    return code
      .replace(/#f4f7db/g, '#bef264')
      .replace(/#eef1cc/g, '#a3e635')
      .replace(/#e4e9b8/g, '#84cc16');
  });
});

console.log("Pastel colors replaced with vibrant lime greens");

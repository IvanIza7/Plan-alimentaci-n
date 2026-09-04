const fs = require('fs');

function replaceFile(path, replacer) {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf-8');
    code = replacer(code);
    fs.writeFileSync(path, code, 'utf-8');
  }
}

replaceFile('src/components/ShoppingView.tsx', code => {
  // Line 166 & 223
  return code.replace(
    /className="text-center p-10 border-2 border-dashed border-border-subtle rounded-\[32px\]"/g,
    'className="text-center p-10 bg-surface border-2 border-dashed border-text-main rounded-[32px]"'
  );
});

replaceFile('src/components/InventoryView.tsx', code => {
  return code.replace(
    /className="col-span-full py-6 text-center border-2 border-dashed border-text-main\/30 rounded-\[24px\]"/g,
    'className="col-span-full py-6 text-center bg-surface border-2 border-dashed border-text-main rounded-[24px]"'
  );
});

console.log("Empty states fixed");

const fs = require('fs');
let code = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');
code = code.replace(/qty: \\`\\\\\$\{item.lowThreshold\} \\\\\$\{item.unit\}\\`/, 'qty: `${item.lowThreshold} ${item.unit}`');
// I'll just use a safer regex replacement
code = code.replace(/qty: .*?,/, 'qty: `${item.lowThreshold} ${item.unit}`,');
code = code.replace(/<Plus size=\{16\} className=\{\\\`transition-transform/, '<Plus size={16} className={`transition-transform');
code = code.replace(/\\\`\}/, '`}');
code = code.replace(/className=\{\\\`w-1.5/, 'className={`w-1.5');
fs.writeFileSync('src/components/InventoryView.tsx', code, 'utf-8');

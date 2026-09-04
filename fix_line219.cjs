const fs = require('fs');
let code = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');

code = code.replace(/<div className=\{`w-1\.5[^]*?<\/div>/g, "<div className={`w-1.5 h-1.5 rounded-full mt-2 ${getStatus(item) === 'missing' ? 'bg-red-500' : getStatus(item) === 'partial' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>");

fs.writeFileSync('src/components/InventoryView.tsx', code, 'utf-8');

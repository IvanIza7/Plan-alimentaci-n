const fs = require('fs');

let invCode = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');
// Header icons: w-20 h-20 -> w-28 h-28
invCode = invCode.replace(
  /className="w-20 h-20 object-contain drop-shadow-md scale-110 shrink-0"/g,
  'className="w-28 h-28 object-contain drop-shadow-md scale-125 shrink-0"'
);
// Card icons: w-32 h-32 -> w-40 h-40
invCode = invCode.replace(
  /className="w-32 h-32 object-contain mb-3 mt-4 drop-shadow-xl scale-125"/g,
  'className="w-40 h-40 object-contain mb-4 mt-6 drop-shadow-xl scale-[1.35]"'
);
fs.writeFileSync('src/components/InventoryView.tsx', invCode, 'utf-8');

let shopCode = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');
// List item icons: w-20 h-20 -> w-28 h-28
shopCode = shopCode.replace(
  /className="w-20 h-20 object-contain drop-shadow-md scale-110 shrink-0"/g,
  'className="w-28 h-28 object-contain drop-shadow-md scale-125 shrink-0"'
);
// Modal suggestions (inventory filter): w-16 h-16 -> w-20 h-20
shopCode = shopCode.replace(
  /className="w-16 h-16 object-contain drop-shadow-sm scale-110 shrink-0"/g,
  'className="w-24 h-24 object-contain drop-shadow-md scale-110 shrink-0 mb-1"'
);
// Modal categories grid: w-24 h-24 -> w-32 h-32
shopCode = shopCode.replace(
  /className="w-24 h-24 object-contain mb-2 mt-2 drop-shadow-lg scale-125"/g,
  'className="w-32 h-32 object-contain mb-2 mt-3 drop-shadow-xl scale-[1.35]"'
);
fs.writeFileSync('src/components/ShoppingView.tsx', shopCode, 'utf-8');

console.log("Updated to huge icon sizes");

const fs = require('fs');

let invCode = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');
// Header icons
invCode = invCode.replace(
  /className="w-14 h-14 object-contain drop-shadow-sm scale-110"/g,
  'className="w-20 h-20 object-contain drop-shadow-md scale-110 shrink-0"'
);
// Card icons
invCode = invCode.replace(
  /className="w-20 h-20 object-contain mb-2 mt-2 drop-shadow-md scale-110"/g,
  'className="w-32 h-32 object-contain mb-3 mt-4 drop-shadow-xl scale-125"'
);
fs.writeFileSync('src/components/InventoryView.tsx', invCode, 'utf-8');

let shopCode = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');
// List item icons
shopCode = shopCode.replace(
  /className="w-14 h-14 object-contain drop-shadow-sm scale-110"/g,
  'className="w-20 h-20 object-contain drop-shadow-md scale-110 shrink-0"'
);
// Modal suggestions (inventory filter)
shopCode = shopCode.replace(
  /className="w-10 h-10 object-contain drop-shadow-sm"/g,
  'className="w-16 h-16 object-contain drop-shadow-sm scale-110 shrink-0"'
);
// Modal categories grid
shopCode = shopCode.replace(
  /className="w-16 h-16 object-contain mb-2 drop-shadow-md scale-110"/g,
  'className="w-24 h-24 object-contain mb-2 mt-2 drop-shadow-lg scale-125"'
);
fs.writeFileSync('src/components/ShoppingView.tsx', shopCode, 'utf-8');

console.log("Updated to much larger icon sizes");

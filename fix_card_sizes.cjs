const fs = require('fs');

let invCode = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');
// Header icons
invCode = invCode.replace(
  /className="w-28 h-28 object-contain drop-shadow-md scale-125 shrink-0"/g,
  'className="w-8 h-8 object-contain drop-shadow-sm scale-[2] transform-gpu origin-center shrink-0 mx-2"'
);
// Card icons
invCode = invCode.replace(
  /className="w-40 h-40 object-contain mb-4 mt-6 drop-shadow-xl scale-\[1\.35\]"/g,
  'className="w-12 h-12 object-contain mb-3 mt-2 drop-shadow-md scale-[2.2] transform-gpu origin-center"'
);
fs.writeFileSync('src/components/InventoryView.tsx', invCode, 'utf-8');

let shopCode = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');
// List item icons
shopCode = shopCode.replace(
  /className="w-28 h-28 object-contain drop-shadow-md scale-125 shrink-0"/g,
  'className="w-8 h-8 object-contain drop-shadow-sm scale-[1.8] transform-gpu origin-center shrink-0 mx-2"'
);
// Modal suggestions (inventory filter)
shopCode = shopCode.replace(
  /className="w-24 h-24 object-contain drop-shadow-md scale-110 shrink-0 mb-1"/g,
  'className="w-6 h-6 object-contain drop-shadow-sm scale-[1.8] transform-gpu origin-center shrink-0 mb-1 mx-2"'
);
// Modal categories grid
shopCode = shopCode.replace(
  /className="w-32 h-32 object-contain mb-2 mt-3 drop-shadow-xl scale-\[1\.35\]"/g,
  'className="w-10 h-10 object-contain mb-2 drop-shadow-md scale-[2.2] transform-gpu origin-center"'
);
fs.writeFileSync('src/components/ShoppingView.tsx', shopCode, 'utf-8');

console.log("Restored base card sizes and used scale to make icons larger");

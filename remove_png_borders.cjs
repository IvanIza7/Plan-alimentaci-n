const fs = require('fs');

let invCode = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');
invCode = invCode.replace(
  /className="w-8 h-8 object-cover rounded-md border-2 border-text-main bg-white"/g,
  'className="w-8 h-8 object-contain"'
);
invCode = invCode.replace(
  /className="w-12 h-12 object-cover rounded-xl border-2 border-text-main mb-3 mt-2 bg-white"/g,
  'className="w-12 h-12 object-contain mb-3 mt-2 drop-shadow-md"'
);
fs.writeFileSync('src/components/InventoryView.tsx', invCode, 'utf-8');

let shopCode = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');
shopCode = shopCode.replace(
  /className="w-8 h-8 object-cover rounded-lg border border-text-main opacity-90 bg-white"/g,
  'className="w-8 h-8 object-contain drop-shadow-sm"'
);
shopCode = shopCode.replace(
  /className="w-6 h-6 object-cover rounded-md border border-text-main bg-white"/g,
  'className="w-6 h-6 object-contain drop-shadow-sm"'
);
shopCode = shopCode.replace(
  /className="w-10 h-10 object-cover rounded-lg border-2 border-text-main mb-2 bg-white"/g,
  'className="w-10 h-10 object-contain mb-2 drop-shadow-md"'
);
fs.writeFileSync('src/components/ShoppingView.tsx', shopCode, 'utf-8');

console.log("Removed borders and backgrounds from PNG icons");

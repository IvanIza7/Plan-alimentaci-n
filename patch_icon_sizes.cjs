const fs = require('fs');

let invCode = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');
// Fix filename
invCode = invCode.replace(/'\/panaderia\.png'/g, "'/panaderia-1.png'");
// Fix sizes
invCode = invCode.replace(
  /className="w-8 h-8 object-contain"/g,
  'className="w-14 h-14 object-contain drop-shadow-sm scale-110"'
);
invCode = invCode.replace(
  /className="w-12 h-12 object-contain mb-3 mt-2 drop-shadow-md"/g,
  'className="w-20 h-20 object-contain mb-2 mt-2 drop-shadow-md scale-110"'
);
fs.writeFileSync('src/components/InventoryView.tsx', invCode, 'utf-8');

let shopCode = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');
// Fix filename
shopCode = shopCode.replace(/'\/panaderia\.png'/g, "'/panaderia-1.png'");
// Fix sizes
shopCode = shopCode.replace(
  /className="w-8 h-8 object-contain drop-shadow-sm"/g,
  'className="w-14 h-14 object-contain drop-shadow-sm scale-110"'
);
shopCode = shopCode.replace(
  /className="w-6 h-6 object-contain drop-shadow-sm"/g,
  'className="w-10 h-10 object-contain drop-shadow-sm"'
);
shopCode = shopCode.replace(
  /className="w-10 h-10 object-contain mb-2 drop-shadow-md"/g,
  'className="w-16 h-16 object-contain mb-2 drop-shadow-md scale-110"'
);
fs.writeFileSync('src/components/ShoppingView.tsx', shopCode, 'utf-8');

console.log("Updated icon sizes and fixed panaderia filename");

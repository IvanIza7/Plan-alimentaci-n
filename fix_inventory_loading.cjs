const fs = require('fs');
let code = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');

code = code.replace(
  "const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppData();",
  "const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, loading } = useAppData();"
);

code = code.replace(
  "{catItems.length === 0 && (",
  "{catItems.length === 0 && !loading && ("
);

fs.writeFileSync('src/components/InventoryView.tsx', code, 'utf-8');

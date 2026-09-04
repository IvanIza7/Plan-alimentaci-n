const fs = require('fs');

let invCode = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');

invCode = invCode.replace(
  /const getCategoryIcon = \(cat: string\) => \{[\s\S]*?return '🛒';\s*\};/,
  `const getCategoryIcon = (cat: string) => {
  if (cat.includes('Frutas')) return '/frutasyverduras.png';
  if (cat.includes('Carnes')) return '/carnes.png';
  if (cat.includes('Lácteos')) return '/lacteos.png';
  if (cat.includes('Panadería')) return '/panaderia.png';
  if (cat.includes('Abarrotes')) return '/abarrotes.png';
  if (cat.includes('Bebidas')) return '/te.png';
  return '🛒';
};`
);

// update InventoryView category header rendering
invCode = invCode.replace(
  /<span className="text-2xl">\{getCategoryIcon\(cat\)\}<\/span>/g,
  `{getCategoryIcon(cat).startsWith('/') ? (
                            <img src={getCategoryIcon(cat)} alt={cat} className="w-8 h-8 object-cover rounded-md border-2 border-text-main bg-white" />
                         ) : (
                            <span className="text-2xl">{getCategoryIcon(cat)}</span>
                         )}`
);
fs.writeFileSync('src/components/InventoryView.tsx', invCode, 'utf-8');

let shopCode = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');

shopCode = shopCode.replace(
  /const catIconMap: Record<string, string> = \{[\s\S]*?'Otros': '🛒'\s*\};/,
  `const catIconMap: Record<string, string> = {
                              'Frutas y Verduras': '/frutasyverduras.png',
                              'Carnes, Aves y Pescados': '/carnes.png',
                              'Lácteos y Huevo': '/lacteos.png',
                              'Panadería y Cereales': '/panaderia.png',
                              'Abarrotes y Despensa': '/abarrotes.png',
                              'Bebidas e Infusiones': '/te.png',
                              'Otros': '🛒'
                           };`
);

// We need to ensure that the image handles the default icon mapping nicely.
// the user says "ya tengo las imagenes que seran para las 6 categorias de inventario", 
// which is for Inventory categories specifically, but ShoppingView uses the same categories.

fs.writeFileSync('src/components/ShoppingView.tsx', shopCode, 'utf-8');
console.log("Patched category icons in Inventory and Shopping");

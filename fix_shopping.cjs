const fs = require('fs');
let code = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');

// The messed up line: 
// setAddMode('custom'); if (addIcon === '🛒') setAddIcon(addCat ? {'Frutas y Verduras':'🍎','Carnes, Aves y Pescados':'🥩','Lácteos y Huevo':'🥛','Panadería y Cereales':'🍞','Abarrotes y Despensa':'🥫','Bebidas e Infusiones':'🧃','Otros':'🛒'}[addCat] || '🛒' : '🛒');;
code = code.replace(
  "setAddMode('custom'); if (addIcon === '🛒') setAddIcon(addCat ? {'Frutas y Verduras':'🍎','Carnes, Aves y Pescados':'🥩','Lácteos y Huevo':'🥛','Panadería y Cereales':'🍞','Abarrotes y Despensa':'🥫','Bebidas e Infusiones':'🧃','Otros':'🛒'}[addCat] || '🛒' : '🛒');;",
  "setAddMode('custom');"
);

code = code.replace(
  /onClick=\{\(\) => setAddMode\('custom'\)\}/g,
  "onClick={() => { setAddMode('custom'); if (addIcon === '🛒') setAddIcon({'Frutas y Verduras':'🍎','Carnes, Aves y Pescados':'🥩','Lácteos y Huevo':'🥛','Panadería y Cereales':'🍞','Abarrotes y Despensa':'🥫','Bebidas e Infusiones':'🧃','Otros':'🛒'}[addCat] || '🛒'); }}"
);

fs.writeFileSync('src/components/ShoppingView.tsx', code, 'utf-8');

const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf-8');

// Replace mockInventory with updated schema
const newMockInventory = `export const mockInventory = [
  // 1. Frutas y Verduras
  { id: 'v1', category: 'Frutas y Verduras', name: 'Jitomates', amount: 0, unit: 'piezas', lowThreshold: 3, kcal: 22, icon: '🍅' },
  { id: 'v2', category: 'Frutas y Verduras', name: 'Cebollas', amount: 0, unit: 'piezas', lowThreshold: 2, kcal: 40, icon: '🧅' },
  { id: 'v3', category: 'Frutas y Verduras', name: 'Chiles verdes', amount: 0, unit: 'g', lowThreshold: 100, kcal: 40, icon: '🌶️' },
  { id: 'v4', category: 'Frutas y Verduras', name: 'Zanahorias', amount: 0, unit: 'piezas', lowThreshold: 3, kcal: 41, icon: '🥕' },
  { id: 'v5', category: 'Frutas y Verduras', name: 'Espinacas', amount: 0, unit: 'g', lowThreshold: 200, kcal: 23, icon: '🥬' },
  { id: 'v6', category: 'Frutas y Verduras', name: 'Brócoli', amount: 0, unit: 'piezas', lowThreshold: 1, kcal: 34, icon: '🥦' },
  { id: 'f1', category: 'Frutas y Verduras', name: 'Melón', amount: 0, unit: 'piezas', lowThreshold: 1, kcal: 34, icon: '🍈' },
  { id: 'f2', category: 'Frutas y Verduras', name: 'Fresas', amount: 0, unit: 'g', lowThreshold: 200, kcal: 32, icon: '🍓' },
  { id: 'f3', category: 'Frutas y Verduras', name: 'Manzanas', amount: 0, unit: 'piezas', lowThreshold: 3, kcal: 52, icon: '🍎' },
  { id: 'f4', category: 'Frutas y Verduras', name: 'Plátanos', amount: 0, unit: 'piezas', lowThreshold: 3, kcal: 89, icon: '🍌' },

  // 2. Carnes, Aves, Pescados
  { id: 'c1', category: 'Carnes, Aves y Pescados', name: 'Bistec de res', amount: 0, unit: 'g', lowThreshold: 300, kcal: 250, icon: '🥩' },
  { id: 'c2', category: 'Carnes, Aves y Pescados', name: 'Pechuga de pollo', amount: 0, unit: 'g', lowThreshold: 300, kcal: 165, icon: '🍗' },
  { id: 'c3', category: 'Carnes, Aves y Pescados', name: 'Filete de pescado', amount: 0, unit: 'g', lowThreshold: 300, kcal: 105, icon: '🐟' },
  { id: 'c4', category: 'Carnes, Aves y Pescados', name: 'Jamón de pavo', amount: 0, unit: 'g', lowThreshold: 150, kcal: 104, icon: '🥓' },
  { id: 'c5', category: 'Carnes, Aves y Pescados', name: 'Salchichas', amount: 0, unit: 'piezas', lowThreshold: 4, kcal: 300, icon: '🌭' },

  // 3. Lácteos, Quesos y Huevo
  { id: 'l1', category: 'Lácteos y Huevo', name: 'Leche descremada', amount: 0, unit: 'litros', lowThreshold: 1, kcal: 34, icon: '🥛' },
  { id: 'l2', category: 'Lácteos y Huevo', name: 'Queso panela', amount: 0, unit: 'g', lowThreshold: 200, kcal: 293, icon: '🧀' },
  { id: 'l3', category: 'Lácteos y Huevo', name: 'Queso manchego', amount: 0, unit: 'g', lowThreshold: 200, kcal: 320, icon: '🧀' },
  { id: 'l4', category: 'Lácteos y Huevo', name: 'Huevo', amount: 0, unit: 'piezas', lowThreshold: 6, kcal: 155, icon: '🥚' },

  // 4. Panadería y Cereales
  { id: 'p1', category: 'Panadería y Cereales', name: 'Tortillas de maíz', amount: 0, unit: 'kg', lowThreshold: 0.5, kcal: 218, icon: '🫓' },
  { id: 'p2', category: 'Panadería y Cereales', name: 'Pan de caja integral', amount: 0, unit: 'piezas', lowThreshold: 4, kcal: 247, icon: '🍞' },
  { id: 'p3', category: 'Panadería y Cereales', name: 'Arroz blanco', amount: 0, unit: 'g', lowThreshold: 300, kcal: 130, icon: '🍚' },
  { id: 'p4', category: 'Panadería y Cereales', name: 'Avena', amount: 0, unit: 'g', lowThreshold: 250, kcal: 389, icon: '🥣' },

  // 5. Abarrotes y Despensa
  { id: 'a1', category: 'Abarrotes y Despensa', name: 'Atún en agua', amount: 0, unit: 'latas', lowThreshold: 2, kcal: 116, icon: '🥫' },
  { id: 'a2', category: 'Abarrotes y Despensa', name: 'Frijoles refritos', amount: 0, unit: 'bolsas', lowThreshold: 1, kcal: 94, icon: '🫘' },
  { id: 'a3', category: 'Abarrotes y Despensa', name: 'Crema de cacahuate', amount: 0, unit: 'frascos', lowThreshold: 1, kcal: 588, icon: '🥜' },
  { id: 'a4', category: 'Abarrotes y Despensa', name: 'Aceite de oliva', amount: 0, unit: 'botellas', lowThreshold: 1, kcal: 884, icon: '🍾' },
  
  // 6. Bebidas
  { id: 'b1', category: 'Bebidas e Infusiones', name: 'Té sin azúcar', amount: 0, unit: 'cajas', lowThreshold: 1, kcal: 1, icon: '🍵' },
  { id: 'b2', category: 'Bebidas e Infusiones', name: 'Café soluble', amount: 0, unit: 'frascos', lowThreshold: 1, kcal: 2, icon: '☕' },
];`;

code = code.replace(/export const mockInventory = \[[^]*?\];/, newMockInventory);
fs.writeFileSync('src/data.ts', code, 'utf-8');

export const mockInventory = [
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
];

export const mockMenus = [
  {
    id: 'm1',
    title: 'Menú 1',
    subtitle: 'Proteína y frescos',
    meals: [
      { id: '1', type: 'DESAYUNO', time: '08:00 AM', name: 'Huevos revueltos y fruta', status: 'available', statusText: 'Disponible', icon: '🍳',
        ingredients: [
          { name: 'Fruta picada', qty: '2 tazas', icon: '🍉', ready: true },
          { name: 'Huevos', qty: '2 pzas', icon: '🥚', ready: true },
          { name: 'Tortilla de maíz', qty: '1 pza', icon: '🫓', ready: true },
          { name: 'Té', qty: '1 taza', icon: '🍵', ready: true }
        ]
      },
      { id: '2', type: 'COMIDA', time: '02:30 PM', name: 'Puntas a la mexicana', status: 'partial', statusText: 'Parcial', icon: '🥩',
        ingredients: [
          { name: 'Arroz blanco', qty: '1 taza', icon: '🍚', ready: true },
          { name: 'Puntas de res', qty: '200 g', icon: '🥩', ready: true },
          { name: 'Zanahoria', qty: '½ taza', icon: '🥕', ready: false },
          { name: 'Ate', qty: '2 rebanadas', icon: '🍬', ready: true }
        ]
      },
      { id: '3', type: 'CENA', time: '08:00 PM', name: 'Sándwich caliente', status: 'available', statusText: 'Disponible', icon: '🥪',
        ingredients: [
          { name: 'Pan integral', qty: '2 reb', icon: '🍞', ready: true },
          { name: 'Jamón de pavo', qty: '4 reb', icon: '🥓', ready: true },
          { name: 'Leche descr.', qty: '1 taza', icon: '🥛', ready: true },
          { name: 'Manzana', qty: '1 pza', icon: '🍎', ready: true }
        ]
      },
      { id: '4', type: 'COLACIÓN', time: '12:00 PM', name: 'Pera', status: 'available', statusText: 'Disponible', icon: '🍐',
        ingredients: [
          { name: 'Pera', qty: '1 pza', icon: '🍐', ready: true }
        ]
      }
    ]
  },
  {
    id: 'm2',
    title: 'Menú 2',
    subtitle: 'Ligero y balanceado',
    meals: [
      { id: '1', type: 'DESAYUNO', time: '08:30 AM', name: 'Enchiladas de requesón', status: 'missing', statusText: 'Faltante', icon: '🌮',
        ingredients: [
          { name: 'Tortillas', qty: '2 pzas', icon: '🫓', ready: true },
          { name: 'Requesón', qty: '6 cdas', icon: '🧀', ready: false },
          { name: 'Melón', qty: '1 taza', icon: '🍈', ready: false }
        ]
      },
      { id: '2', type: 'COMIDA', time: '02:30 PM', name: 'Pechugas rellenas', status: 'available', statusText: 'Disponible', icon: '🍗',
        ingredients: [
          { name: 'Crema zanahoria', qty: '1 tazón', icon: '🥣', ready: true },
          { name: 'Pechuga pollo', qty: '200 g', icon: '🍗', ready: true },
          { name: 'Duraznos', qty: '2 pzas', icon: '🍑', ready: true }
        ]
      },
      { id: '3', type: 'CENA', time: '08:00 PM', name: 'Molletes', status: 'available', statusText: 'Disponible', icon: '🥖',
        ingredients: [
          { name: 'Bolillo', qty: '1 pza', icon: '🥖', ready: true },
          { name: 'Frijoles', qty: '2 cdas', icon: '🫘', ready: true },
          { name: 'Queso panela', qty: '100 g', icon: '🧀', ready: true }
        ]
      },
      { id: '4', type: 'COLACIÓN', time: '11:00 AM', name: 'Manzana con cottage', status: 'available', statusText: 'Disponible', icon: '🍎',
        ingredients: [
          { name: 'Manzana', qty: '1 pza', icon: '🍎', ready: true },
          { name: 'Cottage', qty: '2 cdas', icon: '🧀', ready: true }
        ]
      }
    ]
  },
  {
    id: 'm3',
    title: 'Menú 3',
    subtitle: 'Práctico y fresco',
    meals: [
      { id: '1', type: 'DESAYUNO', time: '08:00 AM', name: 'Pan francés', status: 'available', statusText: 'Disponible', icon: '🍞',
        ingredients: [
          { name: 'Pan de caja', qty: '2 reb', icon: '🍞', ready: true },
          { name: 'Huevo', qty: '1 pza', icon: '🥚', ready: true },
          { name: 'Manzana', qty: '1 pza', icon: '🍎', ready: true }
        ]
      },
      { id: '2', type: 'COMIDA', time: '02:30 PM', name: 'Tostadas de surimi', status: 'partial', statusText: 'Parcial', icon: '🌮',
        ingredients: [
          { name: 'Sopa cebolla', qty: '1 tazón', icon: '🥣', ready: true },
          { name: 'Surimi', qty: '150 g', icon: '🦀', ready: false },
          { name: 'Tostadas', qty: '3 pzas', icon: '🫓', ready: true },
          { name: 'Kiwi', qty: '2 pzas', icon: '🥝', ready: true }
        ]
      },
      { id: '3', type: 'CENA', time: '08:00 PM', name: 'Salchichas guisadas', status: 'available', statusText: 'Disponible', icon: '🌭',
        ingredients: [
          { name: 'Salchichas', qty: '3 pzas', icon: '🌭', ready: true },
          { name: 'Pan integral', qty: '1 reb', icon: '🍞', ready: true },
          { name: 'Leche', qty: '1 taza', icon: '🥛', ready: true }
        ]
      },
      { id: '4', type: 'COLACIÓN', time: '11:30 AM', name: 'Piña y queso', status: 'available', statusText: 'Disponible', icon: '🍍',
        ingredients: [
          { name: 'Piña', qty: '1 taza', icon: '🍍', ready: true },
          { name: 'Queso Oaxaca', qty: '30 g', icon: '🧀', ready: true }
        ]
      }
    ]
  },
  {
    id: 'm4',
    title: 'Menú 4',
    subtitle: 'Rápido y saciante',
    meals: [
      { id: '1', type: 'DESAYUNO', time: '08:00 AM', name: 'Quesadillas', status: 'available', statusText: 'Disponible', icon: '🌮',
        ingredients: [
          { name: 'Tortillas hrn', qty: '2 pzas', icon: '🫓', ready: true },
          { name: 'Queso panela', qty: '120 g', icon: '🧀', ready: true },
          { name: 'Sandía', qty: '1 taza', icon: '🍉', ready: true }
        ]
      },
      { id: '2', type: 'COMIDA', time: '02:30 PM', name: 'Salpicón de res', status: 'available', statusText: 'Disponible', icon: '🥗',
        ingredients: [
          { name: 'Crema calabaza', qty: '1 tazón', icon: '🥣', ready: true },
          { name: 'Deshebrada', qty: '200 g', icon: '🥩', ready: true },
          { name: 'Mango', qty: '1 pza', icon: '🥭', ready: true }
        ]
      },
      { id: '3', type: 'CENA', time: '08:00 PM', name: 'Bísquet con pavo', status: 'available', statusText: 'Disponible', icon: '🥐',
        ingredients: [
          { name: 'Bísquet', qty: '1 pza', icon: '🥐', ready: true },
          { name: 'Pechuga pavo', qty: '3 reb', icon: '🥓', ready: true },
          { name: 'Mermelada', qty: '2 cdtas', icon: '🍯', ready: true }
        ]
      },
      { id: '4', type: 'COLACIÓN', time: '11:30 AM', name: 'Papaya', status: 'available', statusText: 'Disponible', icon: '🍈',
        ingredients: [
          { name: 'Papaya', qty: '1 taza', icon: '🍈', ready: true }
        ]
      }
    ]
  },
  {
    id: 'm5',
    title: 'Menú 5',
    subtitle: 'Clásico de fin de semana',
    meals: [
      { id: '1', type: 'DESAYUNO', time: '09:00 AM', name: 'Huevos rancheros', status: 'available', statusText: 'Disponible', icon: '🍳',
        ingredients: [
          { name: 'Huevos', qty: '2 pzas', icon: '🥚', ready: true },
          { name: 'Tortilla maíz', qty: '1 pza', icon: '🫓', ready: true },
          { name: 'Tunas', qty: '2 pzas', icon: '🌵', ready: true }
        ]
      },
      { id: '2', type: 'COMIDA', time: '03:00 PM', name: 'Pescado empapelado', status: 'missing', statusText: 'Faltante', icon: '🐟',
        ingredients: [
          { name: 'Sopa fideo', qty: '1 tazón', icon: '🥣', ready: true },
          { name: 'Pescado', qty: '250 g', icon: '🐟', ready: false },
          { name: 'Mandarina', qty: '1 pza', icon: '🍊', ready: true }
        ]
      },
      { id: '3', type: 'CENA', time: '08:30 PM', name: 'Tacos de asada', status: 'available', statusText: 'Disponible', icon: '🌮',
        ingredients: [
          { name: 'Tortillas', qty: '2 pzas', icon: '🫓', ready: true },
          { name: 'Bistec res', qty: '100 g', icon: '🥩', ready: true }
        ]
      },
      { id: '4', type: 'COLACIÓN', time: '12:30 PM', name: 'Ciruelas', status: 'available', statusText: 'Disponible', icon: '🫐',
        ingredients: [
          { name: 'Ciruelas', qty: '2 pzas', icon: '🫐', ready: true }
        ]
      }
    ]
  },
  {
    id: 'm6',
    title: 'Menú 6',
    subtitle: 'Opciones indulgentes',
    meals: [
      { id: '1', type: 'DESAYUNO', time: '09:00 AM', name: 'Cuernito de pavo', status: 'available', statusText: 'Disponible', icon: '🥐',
        ingredients: [
          { name: 'Cuernito', qty: '1 pza', icon: '🥐', ready: true },
          { name: 'Pechuga pavo', qty: '3 reb', icon: '🥓', ready: true },
          { name: 'Queso Oaxaca', qty: '90 g', icon: '🧀', ready: true },
          { name: 'Fruta', qty: '1 taza', icon: '🍉', ready: true }
        ]
      },
      { id: '2', type: 'COMIDA', time: '02:30 PM', name: 'Queso panela asado', status: 'available', statusText: 'Disponible', icon: '🧀',
        ingredients: [
          { name: 'Sopa rajas', qty: '1 tazón', icon: '🥣', ready: true },
          { name: 'Queso panela', qty: '250 g', icon: '🧀', ready: true },
          { name: 'Nopal asado', qty: '1 pza', icon: '🌵', ready: true },
          { name: 'Plátanos', qty: '2 pzas', icon: '🍌', ready: true }
        ]
      },
      { id: '3', type: 'CENA', time: '08:30 PM', name: 'Pizza de atún', status: 'available', statusText: 'Disponible', icon: '🍕',
        ingredients: [
          { name: 'Pan árabe', qty: '1 pza', icon: '🫓', ready: true },
          { name: 'Atún', qty: '60 g', icon: '🥫', ready: true },
          { name: 'Q. manchego', qty: '60 g', icon: '🧀', ready: true }
        ]
      },
      { id: '4', type: 'COLACIÓN', time: '11:30 AM', name: 'Naranja', status: 'available', statusText: 'Disponible', icon: '🍊',
        ingredients: [
          { name: 'Naranja', qty: '1 pza', icon: '🍊', ready: true }
        ]
      }
    ]
  },
  {
    id: 'm7',
    title: 'Menú 7',
    subtitle: 'Comodidad total',
    meals: [
      { id: '1', type: 'DESAYUNO', time: '09:30 AM', name: 'Chilaquiles verdes', status: 'available', statusText: 'Disponible', icon: '🌶️',
        ingredients: [
          { name: 'Tortillas', qty: '3 pzas', icon: '🫓', ready: true },
          { name: 'Pollo deshebr.', qty: '60 g', icon: '🍗', ready: true },
          { name: 'Jugo naranja', qty: '1 taza', icon: '🍊', ready: true }
        ]
      },
      { id: '2', type: 'COMIDA', time: '03:00 PM', name: 'Pollo con ajonjolí', status: 'available', statusText: 'Disponible', icon: '🍗',
        ingredients: [
          { name: 'Crema brócoli', qty: '1 tazón', icon: '🥣', ready: true },
          { name: 'Pollo', qty: '200 g', icon: '🍗', ready: true },
          { name: 'Ensalada', qty: '1 taza', icon: '🥗', ready: true }
        ]
      },
      { id: '3', type: 'CENA', time: '08:00 PM', name: 'Cereal con leche', status: 'available', statusText: 'Disponible', icon: '🥣',
        ingredients: [
          { name: 'Cereal', qty: '1.5 tazas', icon: '🥣', ready: true },
          { name: 'Leche', qty: '1 taza', icon: '🥛', ready: true },
          { name: 'Plátano', qty: '1 pza', icon: '🍌', ready: true }
        ]
      },
      { id: '4', type: 'COLACIÓN', time: '12:00 PM', name: 'Queso Oaxaca', status: 'available', statusText: 'Disponible', icon: '🧀',
        ingredients: [
          { name: 'Queso Oaxaca', qty: '90 g', icon: '🧀', ready: true }
        ]
      }
    ]
  }
];

export const mockMissing = [
  { id: 'm1', name: 'Melón', qty: '1 taza', icon: '🍈' },
  { id: 'm2', name: 'Queso manchego', qty: '60 g', icon: '🧀' },
  { id: 'm3', name: 'Pescado', qty: '250 g', icon: '🐟' }
];

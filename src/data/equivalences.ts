export interface EquivalentItem {
  name: string;
  amount: string;
  notes?: string;
}

export interface EquivalentCategory {
  id: string;
  name: string;
  kcal: number;
  macros: { p: number; c: number; f: number }; // protein, carbs, fat
  items: EquivalentItem[];
}

export const equivalencesData: EquivalentCategory[] = [
  {
    id: "cereales",
    name: "Cereales y Tubérculos",
    kcal: 70,
    macros: { p: 2, c: 15, f: 0 },
    items: [
      { name: "Tortilla de maíz", amount: "1 pieza med." },
      { name: "Bolillo sin migajón", amount: "1/2 pieza" },
      { name: "Pan de caja", amount: "1 rebanada" },
      { name: "Pan bimbo CERO CERO", amount: "1.5 Rebanadas" },
      { name: "Tostadas SANÍSSIMO", amount: "2 Tostadas" },
      { name: "Bollo para hamburguesa mediano", amount: "1/2 pieza" },
      { name: "Medias noches", amount: "1/2 pieza" },
      { name: "Pan árabe", amount: "1/2 pieza" },
      { name: "Hojuelas de avena secas", amount: "2 cucharadas" },
      { name: "Granola o harina de trigo", amount: "2 cucharadas" },
      { name: "Cereal de salvado de trigo", amount: "1/2 taza" },
      { name: "Hojuelas sin azúcar", amount: "3/4 taza" },
      { name: "Cereal azucarado", amount: "1/2 taza" },
      { name: "Maíz palomero inflado", amount: "3 tazas" },
      { name: "Arroz cocido", amount: "1/2 taza" },
      { name: "Pasta cocida", amount: "1/2 taza" },
      { name: "Elote (granos)", amount: "1/3 taza" },
      { name: "Camote (en cubitos pequeños)", amount: "1/4 taza" },
      { name: "Papa (en cubitos pequeños)", amount: "1/2 taza" },
      { name: "Pan dulce", amount: "1/2 pieza", notes: "Eliminar un equivalente de lípidos" },
      { name: "Hot cake PEQUEÑO", amount: "1 pieza", notes: "Eliminar un equivalente de lípidos" },
      { name: "Galleta de mantequilla", amount: "2 piezas", notes: "Eliminar un equivalente de lípidos" },
      { name: "Galleta con chispas de chocolate", amount: "1 1/2 pza", notes: "Eliminar un equivalente de lípidos" },
      { name: "Galleta sandwich", amount: "1 pieza", notes: "Eliminar un equivalente de lípidos" },
      { name: "Tamal mediano", amount: "1/2 pieza", notes: "Eliminar un equivalente de lípidos" },
      { name: "Galleta María", amount: "4 piezas" },
      { name: "Galletas saladas pequeñas", amount: "4 piezas" },
      { name: "Galleta habanera", amount: "3 piezas" },
      { name: "SALMAS", amount: "1 paquete" },
      { name: "Barras All Bran", amount: "1/2 paquete" },
      { name: "Barra Special K", amount: "1 Barra" },
      { name: "Bollo THINS", amount: "1 pieza" }
    ]
  },
  {
    id: "leguminosas",
    name: "Leguminosas",
    kcal: 105,
    macros: { p: 8, c: 20, f: 0 },
    items: [
      { name: "Alubia cocida", amount: "1/2 taza" },
      { name: "Frijol cocido", amount: "1/2 taza" },
      { name: "Garbanzo cocido", amount: "1/2 taza" },
      { name: "Haba seca cocida", amount: "1/2 taza" },
      { name: "Lenteja cocida", amount: "1/2 taza" },
      { name: "Soya texturizada (hidratada)", amount: "2/3 taza" }
    ]
  },
  {
    id: "origen_animal",
    name: "Alimentos de Origen Animal",
    kcal: 75,
    macros: { p: 7, c: 0, f: 5 }, // aprox average
    items: [
      { name: "Huevo", amount: "1 pieza" },
      { name: "Clara de huevo", amount: "2 piezas" },
      { name: "Aves", amount: "30 g" },
      { name: "Res", amount: "30 g" },
      { name: "Cerdo", amount: "30 g" },
      { name: "Carne seca", amount: "10 g" },
      { name: "Vísceras", amount: "30 g" },
      { name: "Atún o salmón drenado en agua", amount: "1/2 lata" },
      { name: "Pescados y mariscos frescos", amount: "35 g" },
      { name: "Queso PANELA", amount: "50 g" },
      { name: "Oaxaca", amount: "50 g" },
      { name: "Cottage o requesón", amount: "3 cucharadas" },
      { name: "Manchego", amount: "30 g", notes: "Eliminar 1 equivalente de lípidos" },
      { name: "Salchicha (de pavo)", amount: "50 g", notes: "Eliminar 1 equivalente de lípidos" },
      { name: "Jamón (de pavo)", amount: "40 g", notes: "Eliminar 1 equivalente de lípidos" },
      { name: "Salami", amount: "55 g" },
      { name: "Queso de puerco", amount: "50 g", notes: "Eliminar 3 equivalentes de lípidos" },
      { name: "Surimi", amount: "3/4 Barra" }
    ]
  },
  {
    id: "azucares",
    name: "Azúcares",
    kcal: 40,
    macros: { p: 0, c: 10, f: 0 },
    items: [
      { name: "Ate o fruta cristalizada", amount: "Cubo 2x2x2 cm" },
      { name: "Azúcar", amount: "2 cucharaditas" },
      { name: "Polvo para bebida", amount: "2 cucharaditas" },
      { name: "Cajeta", amount: "1 cucharadita" },
      { name: "Caramelo", amount: "1 pza. peq." },
      { name: "Chocolate en polvo", amount: "1 cucharada" },
      { name: "Gelatina de agua", amount: "1/2 taza" },
      { name: "Helado", amount: "1/4 taza" },
      { name: "Jugo de Jitomate (lata)", amount: "360 ml" },
      { name: "Leche condensada", amount: "1 cucharada" },
      { name: "Mermelada", amount: "1 cucharadita" },
      { name: "Miel de abeja", amount: "1 cucharada" },
      { name: "Miel de maple", amount: "1 cucharada" },
      { name: "Nieve", amount: "1/4 taza" },
      { name: "Refresco promedio", amount: "1/3 taza" },
      { name: "Salsa catsup", amount: "3 cucharadas" },
      { name: "Yakult", amount: "1 pieza" }
    ]
  },
  {
    id: "fruta",
    name: "Fruta",
    kcal: 40,
    macros: { p: 0, c: 10, f: 0 },
    items: [
      { name: "Ciruela pasa", amount: "2 pzas. med." },
      { name: "Chabacano", amount: "4 pzas. med." },
      { name: "Chicozapote", amount: "1/2 pieza" },
      { name: "Dátiles", amount: "2 piezas" },
      { name: "Durazno", amount: "1 pieza med." },
      { name: "Frambuesa", amount: "1/2 taza" },
      { name: "Fresa", amount: "1 taza" },
      { name: "Guayaba", amount: "2 pzas. med." },
      { name: "Granada china", amount: "1/4 taza" },
      { name: "Higos", amount: "2 pzas. med." },
      { name: "Jícama", amount: "2/3 taza" },
      { name: "Lima", amount: "2 pzas. med." },
      { name: "Mandarina", amount: "1 pza. med." },
      { name: "Mango", amount: "1/2 pza. med." },
      { name: "Manzana", amount: "1/2 pza. med." },
      { name: "Manzana (jugo)", amount: "1/3 taza" },
      { name: "Mamey", amount: "1/4 taza" },
      { name: "Melón", amount: "1 taza" },
      { name: "Naranja", amount: "1 pza. med." },
      { name: "Naranja (jugo)", amount: "1/2 taza" },
      { name: "Papaya", amount: "1 taza" },
      { name: "Pera", amount: "1/2 pza." },
      { name: "Piña", amount: "1 taza" },
      { name: "Plátano", amount: "1/2 pza. med." },
      { name: "Sandía", amount: "1 taza" },
      { name: "Toronja", amount: "1/2 pieza" },
      { name: "Uvas", amount: "12 piezas" },
      { name: "Zapote negro", amount: "1/3 taza" },
      { name: "Zarzamora", amount: "1/2 taza" }
    ]
  },
  {
    id: "leche",
    name: "Leche",
    kcal: 105,
    macros: { p: 9, c: 12, f: 4 }, // Aproximación leche semidescremada
    items: [
      { name: "Leche entera", amount: "240 ml." },
      { name: "Leche descremada", amount: "500 ml." },
      { name: "Leche descremada en polvo", amount: "3 cucharadas" },
      { name: "Leche evaporada", amount: "1/2 taza" },
      { name: "Yogurt natural", amount: "1 taza" },
      { name: "Yogurt de sabor", amount: "1 taza", notes: "Omitir 4 equivalentes de azúcar" },
      { name: "Yogurt de sabor light", amount: "1 taza" },
      { name: "Yogur p/beber light", amount: "2 tazas" }
    ]
  },
  {
    id: "verduras_a",
    name: "Verduras A (Libre)",
    kcal: 0,
    macros: { p: 0, c: 0, f: 0 },
    items: [
      { name: "Acelgas", amount: "Libre" },
      { name: "Apio", amount: "Libre" },
      { name: "Brócoli", amount: "Libre" },
      { name: "Coliflor", amount: "Libre" },
      { name: "Espinacas", amount: "Libre" },
      { name: "Flor de calabaza", amount: "Libre" },
      { name: "Jitomate", amount: "Libre" },
      { name: "Nabo", amount: "Libre" },
      { name: "Pepino", amount: "Libre" },
      { name: "Romeritos", amount: "Libre" },
      { name: "Verdolagas", amount: "Libre" },
      { name: "Alcachofas (enteras)", amount: "Libre" },
      { name: "Berros", amount: "Libre" },
      { name: "Col", amount: "Libre" },
      { name: "Chayote", amount: "Libre" },
      { name: "Ejote tierno", amount: "Libre" },
      { name: "Hongos", amount: "Libre" },
      { name: "Lechuga", amount: "Libre" },
      { name: "Nopales", amount: "Libre" },
      { name: "Rabanitos", amount: "Libre" },
      { name: "Tomate", amount: "Libre" }
    ]
  },
  {
    id: "verduras_b",
    name: "Verdura B (1/2 Taza)",
    kcal: 25,
    macros: { p: 2, c: 4, f: 0 },
    items: [
      { name: "Betabel", amount: "1/2 Taza" },
      { name: "Calabaza de castilla", amount: "1/2 Taza" },
      { name: "Coles de Bruselas", amount: "1/2 Taza" },
      { name: "Chícharo fresco", amount: "1/2 Taza" },
      { name: "Germinado de soya", amount: "1/2 Taza" },
      { name: "Huauzontle", amount: "1/2 Taza" },
      { name: "Puré de jitomate industrializado", amount: "1/2 Taza" },
      { name: "Zanahoria", amount: "1/2 Taza" },
      { name: "Berenjena", amount: "1/2 Taza" },
      { name: "Cebolla", amount: "1/2 Taza" },
      { name: "Chile poblano", amount: "1/2 Taza" },
      { name: "Espárragos (puntas)", amount: "1/2 Taza" },
      { name: "Haba verde", amount: "1/2 Taza" },
      { name: "Poro", amount: "1/2 Taza" }
    ]
  },
  {
    id: "lipidos",
    name: "Lípidos",
    kcal: 45,
    macros: { p: 0, c: 0, f: 5 },
    items: [
      { name: "Crema espesa", amount: "1 cucharada" },
      { name: "Queso crema", amount: "1 cucharada" },
      { name: "Pepitas", amount: "1 cucharada" },
      { name: "Semilla de girasol", amount: "1 cucharada" },
      { name: "Ajonjolí", amount: "1 cucharada" },
      { name: "Crema de cacahuate", amount: "1 cucharada" },
      { name: "Paté", amount: "1 cucharada" },
      { name: "Mayonesa", amount: "1 cucharada" },
      { name: "Aceites vegetales", amount: "1 cucharada" },
      { name: "Margarina", amount: "1 cucharada" },
      { name: "Mantequilla", amount: "1 cucharadita" },
      { name: "Manteca de cerdo", amount: "1 cucharadita" },
      { name: "Aguacate", amount: "1/5 pieza" },
      { name: "Cacahuate", amount: "6 semillas" },
      { name: "Nueces", amount: "2 piezas" },
      { name: "Piñones", amount: "4 semillas" }
    ]
  },
  {
    id: "libre",
    name: "Puede Consumir Libremente",
    kcal: 0,
    macros: { p: 0, c: 0, f: 0 },
    items: [
      { name: "Café sin azúcar", amount: "Libre" },
      { name: "Infusión de té u otras hierbas", amount: "Libre" },
      { name: "Pimienta", amount: "Libre" },
      { name: "Orégano", amount: "Libre" },
      { name: "Laurel", amount: "Libre" },
      { name: "Azafrán", amount: "Libre" },
      { name: "Epazote", amount: "Libre" },
      { name: "Clavo", amount: "Libre" },
      { name: "Perejil", amount: "Libre" },
      { name: "Cilantro", amount: "Libre" },
      { name: "Comino", amount: "Libre" },
      { name: "Mejorana", amount: "Libre" },
      { name: "Tomillo", amount: "Libre" },
      { name: "Curry", amount: "Libre" },
      { name: "Vinagre", amount: "Libre" },
      { name: "Salsa inglesa", amount: "Libre" },
      { name: "Salsa soya", amount: "Libre" },
      { name: "Consomé en polvo o en cubo", amount: "Libre" },
      { name: "Caldos caseros desgrasados", amount: "Libre" },
      { name: "Limón", amount: "Libre" },
      { name: "Verdura A", amount: "Libre" },
      { name: "Mermelada Smucker's SIN AZÚCAR", amount: "Libre" },
      { name: "Gelatina Light", amount: "Libre" },
      { name: "Splenda (sucralosa)", amount: "Libre" }
    ]
  }
];

export function getNutritionalSummary(ingredients: {name: string, amount: string}[]) {
  let kcal = 0;
  let p = 0;
  let c = 0;
  let f = 0;

  ingredients.forEach(ing => {
    // Busca en qué categoría está el ingrediente
    let foundCategory = null;
    for (const cat of equivalencesData) {
      if (cat.items.some(i => i.name.toLowerCase() === ing.name.toLowerCase())) {
        foundCategory = cat;
        break;
      }
    }
    
    // Si no se encuentra, asume que no cuenta o puedes añadir lógica de fall-back
    if (foundCategory) {
      // Asume 1 porción por ingrediente a menos que haya multiplicador (simplificado)
      // Idealmente parseas la cantidad, pero por ahora sumamos 1 equivalente
      kcal += foundCategory.kcal;
      p += foundCategory.macros.p;
      c += foundCategory.macros.c;
      f += foundCategory.macros.f;
    }
  });

  return { kcal, p, c, f };
}

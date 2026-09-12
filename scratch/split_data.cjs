const fs = require('fs');

const content = fs.readFileSync('src/data.ts', 'utf8');

// Use eval to extract the arrays
let mockInventoryStr = content.match(/export const mockInventory = (\[.*?\]);\n/s)[1];
let mockMenusStr = content.match(/export const mockMenus = (\[.*\]);/s)[1];

let inventory = eval(mockInventoryStr);
let menus = eval(mockMenusStr);

const transformations = [
  { match: "Avena o amaranto o granola", primary: "Avena", equivalents: ["Amaranto", "Granola"] },
  { match: "Plátano, fresas o mango", primary: "Plátano", equivalents: ["Fresas", "Mango"] },
  { match: "Chocolate en polvo, azúcar o miel", primary: "Chocolate en polvo", equivalents: ["Azúcar", "Miel"] },
  { match: "Salsa verde o roja", primary: "Salsa verde", equivalents: ["Salsa roja"] },
  { match: "Tortilla de maíz o nopal", primary: "Tortilla de maíz", equivalents: ["Tortilla de nopal"] },
  { match: "Barra de granola o pan dulce", primary: "Barra de granola", equivalents: ["Pan dulce"] },
  { match: "Pan (sándwich, torta, cuernito o bagel)", primary: "Pan de sándwich", equivalents: ["Torta", "Cuernito", "Bagel"] },
  { match: "Jamón, Queso, Pollo o Salchicha", primary: "Jamón", equivalents: ["Queso", "Pollo", "Salchicha"] },
  { match: "Bolillo o galletas integrales", primary: "Bolillo", equivalents: ["Galletas integrales"] },
  { match: "Jugo de naranja o mandarina", primary: "Jugo de naranja", equivalents: ["Jugo de mandarina"] }
];

// 1. Transform Menus
menus.forEach(m => {
  m.meals.forEach(meal => {
    const processItem = (ing) => {
      const transform = transformations.find(t => t.match === ing.name);
      if (transform) {
        ing.name = transform.primary;
        ing.customEquivalences = transform.equivalents.map(eq => ({
          name: eq,
          qty: ing.qty,
          icon: ing.icon,
          ready: true
        }));
      }
    };
    (meal.ingredients || []).forEach(processItem);
    (meal.dishes || []).forEach(d => (d.ingredients || []).forEach(processItem));
  });
});

// 2. Transform Inventory
// For each transformation, if we find an inventory item with the exact match name,
// we change its name to the primary, and ADD new items for each equivalent.
const newInventoryItems = [];
inventory.forEach(item => {
  const transform = transformations.find(t => t.match === item.name);
  if (transform) {
    item.name = transform.primary;
    transform.equivalents.forEach((eq, idx) => {
      newInventoryItems.push({
        ...item,
        id: item.id + '-eq' + idx,
        name: eq
      });
    });
  }
});
inventory.push(...newInventoryItems);

const outContent = `export const mockInventory = ${JSON.stringify(inventory, null, 2)};

export const mockMenus = ${JSON.stringify(menus, null, 2)};
`;

fs.writeFileSync('src/data.ts', outContent);
console.log('data.ts updated!');

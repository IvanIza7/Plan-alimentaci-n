const fs = require('fs');

let code = fs.readFileSync('src/components/EquivalenceSwapModal.tsx', 'utf-8');

code = code.replace(/  \/\/ Find category for the ingredient[\s\S]*?const availableEquivalences = category \? category\.items : equivalencesData\[0\]\.items; \/\/ Fallback to first cat if not found/,
`  const getCategory = () => {
    const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/s$/, '').replace(/es$/, '');
    const ingN = normalize(ingredient.name);

    let cat = equivalencesData.find(c => 
      c.items.some(item => {
        const itemN = normalize(item.name);
        return ingN.includes(itemN) || itemN.includes(ingN);
      })
    );
    if (cat) return cat;

    if (ingN.includes('fruta') || ingN.includes('mango') || ingN.includes('sandia') || ingN.includes('melon') || ingN.includes('papaya') || ingN.includes('pina') || ingN.includes('manzana') || ingN.includes('platano') || ingN.includes('kiwi') || ingN.includes('tuna') || ingN.includes('ciruela') || ingN.includes('naranja') || ingN.includes('uva')) {
      return equivalencesData.find(c => c.id === 'fruta');
    }
    if (ingN.includes('queso') || ingN.includes('huevo') || ingN.includes('pollo') || ingN.includes('pavo') || ingN.includes('res') || ingN.includes('carne') || ingN.includes('atun') || ingN.includes('salchicha') || ingN.includes('pescado') || ingN.includes('surimi') || ingN.includes('deshebrada') || ingN.includes('cerdo')) {
      return equivalencesData.find(c => c.id === 'origen_animal');
    }
    if (ingN.includes('pan') || ingN.includes('tortilla') || ingN.includes('tostada') || ingN.includes('arroz') || ingN.includes('avena') || ingN.includes('cereal') || ingN.includes('bisquet') || ingN.includes('cuernito') || ingN.includes('fideo')) {
      return equivalencesData.find(c => c.id === 'cereales');
    }
    if (ingN.includes('leche') || ingN.includes('yogurt') || ingN.includes('crema')) {
      return equivalencesData.find(c => c.id === 'leche');
    }
    if (ingN.includes('sopa') || ingN.includes('ensalada') || ingN.includes('verdura') || ingN.includes('nopal') || ingN.includes('rajas') || ingN.includes('brocoli') || ingN.includes('cebolla') || ingN.includes('espinaca')) {
      return equivalencesData.find(c => c.id === 'verduras_b');
    }

    return equivalencesData[0];
  };

  const category = getCategory();
  const availableEquivalences = category ? category.items : equivalencesData[0].items;`);

fs.writeFileSync('src/components/EquivalenceSwapModal.tsx', code, 'utf-8');
console.log("Updated Swap Modal");

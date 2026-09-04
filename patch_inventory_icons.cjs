const fs = require('fs');

let code = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');

// The rendering of the icon happens in: <span className="text-4xl mb-3 mt-2">{item.icon}</span>
code = code.replace(
  /<span className="text-4xl mb-3 mt-2">\{item\.icon\}<\/span>/g,
  `{item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                    <img src={item.icon} alt={item.name} className="w-12 h-12 object-cover rounded-xl border-2 border-text-main mb-3 mt-2 bg-white" />
                                 ) : (
                                    <span className="text-4xl mb-3 mt-2">{item.icon}</span>
                                 )}`
);

// We should also adjust the input placeholder to mention that they can use a path.
code = code.replace(
  /<input type="text" value=\{addIcon\} onChange=\{e => setAddIcon\(e\.target\.value\)\} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-center text-2xl focus:outline-none focus:border-primary-500" \/>/,
  `<input type="text" placeholder="🍎 o /img.png" value={addIcon} onChange={e => setAddIcon(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-center text-sm focus:outline-none focus:border-primary-500" title="Usa un emoji o la ruta de tu imagen local" />`
);

fs.writeFileSync('src/components/InventoryView.tsx', code, 'utf-8');
console.log("Patched InventoryView icons");

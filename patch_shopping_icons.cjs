const fs = require('fs');
let code = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');

// The main list rendering: <span className="text-2xl opacity-90">{item.icon}</span>
code = code.replace(
  /<span className="text-2xl opacity-90">\{item\.icon\}<\/span>/g,
  `{item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                 <img src={item.icon} alt={item.name} className="w-8 h-8 object-cover rounded-lg border border-text-main opacity-90 bg-white" />
                              ) : (
                                 <span className="text-2xl opacity-90">{item.icon}</span>
                              )}`
);

// History list rendering: <span className="text-lg">{item.icon}</span>
code = code.replace(
  /<span className="text-lg">\{item\.icon\}<\/span>/g,
  `{item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                                <img src={item.icon} alt={item.name} className="w-6 h-6 object-cover rounded-md border border-text-main bg-white" />
                                             ) : (
                                                <span className="text-lg">{item.icon}</span>
                                             )}`
);

// Catalog quick add rendering: <span className="text-3xl mb-2">{item.icon}</span>
code = code.replace(
  /<span className="text-3xl mb-2">\{item\.icon\}<\/span>/g,
  `{item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                       <img src={item.icon} alt={item.name} className="w-10 h-10 object-cover rounded-lg border-2 border-text-main mb-2 bg-white" />
                                    ) : (
                                       <span className="text-3xl mb-2">{item.icon}</span>
                                    )}`
);

fs.writeFileSync('src/components/ShoppingView.tsx', code, 'utf-8');
console.log("Patched ShoppingView icons");

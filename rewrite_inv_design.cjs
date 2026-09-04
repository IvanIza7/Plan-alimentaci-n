const fs = require('fs');
let code = fs.readFileSync('src/components/InventoryView.tsx', 'utf-8');

// The original category list
// <div key={cat} className="bg-surface rounded-[24px] border-2 border-border-subtle overflow-hidden">
const replacement = `
               <div key={cat} className="bg-[#f4f7db] rounded-[32px] border-2 border-text-main overflow-hidden shadow-[8px_8px_0_0_var(--color-text-main)] mb-6">
                  <button onClick={() => toggleCat(cat)} className="w-full p-5 flex justify-between items-center bg-[#eef1cc] border-b-2 border-text-main hover:bg-[#e4e9b8] transition-colors">
                     <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(cat)}</span>
                        <div className="text-left">
                           <h3 className="font-black text-sm uppercase tracking-widest text-text-main">{cat}</h3>
                           <p className="text-[10px] font-bold text-text-secondary">{catItems.length} alimentos</p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)]">
                        <Plus size={16} className={\`transition-transform duration-300 \${isExpanded ? 'rotate-45 text-red-500' : 'text-text-main'}\`} />
                     </div>
                  </button>
                  {isExpanded && (
                     <div className="p-5 bg-[#f4f7db] transition-all duration-300 ease-in-out">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {catItems.map(item => (
                              <div key={item.id} onClick={() => { setSelectedItem(item); setQuickAmount(item.amount); }} className="bg-surface border-2 border-text-main rounded-[24px] p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--color-text-main)] transition-all relative">
                                 {getStatus(item) !== 'available' && (
                                    <div className="absolute -top-2 -right-2">
                                       <button onClick={(e) => { e.stopPropagation(); handleAddToShopping(item); }} className="w-8 h-8 bg-primary-500 text-surface rounded-full flex items-center justify-center border-2 border-text-main shadow-[2px_2px_0_0_var(--color-text-main)] hover:bg-primary-600 transition-colors z-10" title="Agregar a compras">
                                          <ShoppingCart size={14} />
                                       </button>
                                    </div>
                                 )}
                                 <span className="text-4xl mb-3 mt-2">{item.icon}</span>
                                 <p className="font-bold text-xs text-text-main leading-tight line-clamp-2">{item.name}</p>
                                 <p className="text-[10px] font-black text-text-secondary mt-1">{item.amount} {item.unit}</p>
                                 <div className={\`w-2 h-2 rounded-full mt-3 border border-text-main \${getStatus(item) === 'missing' ? 'bg-red-500' : getStatus(item) === 'partial' ? 'bg-yellow-500' : 'bg-green-500'}\`}></div>
                              </div>
                           ))}
                           {catItems.length === 0 && (
                              <div className="col-span-full py-6 text-center border-2 border-dashed border-text-main/30 rounded-[24px]">
                                 <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Sin alimentos en esta categoría</p>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
`;

code = code.replace(/<div key=\{cat\} className="bg-surface rounded-\[24px\] border-2 border-border-subtle overflow-hidden">[\s\S]*?<\/div>\s*\);\s*\}\)}\s*<\/div>/, replacement.trim() + `\n            );\n         })}\n      </div>`);

fs.writeFileSync('src/components/InventoryView.tsx', code, 'utf-8');

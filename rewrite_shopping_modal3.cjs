const fs = require('fs');
let code = fs.readFileSync('src/components/ShoppingView.tsx', 'utf-8');

const targetStr = `<div className="max-h-[40vh] overflow-y-auto p-1 custom-scrollbar">
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                           {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                              <button key={item.id} onClick={() => {
                                 setAddName(item.name);
                                 setAddCat(CATEGORIES.find(c => c.toUpperCase().includes(item.category.split(',')[0].toUpperCase())) || CATEGORIES[6]);
                                 setAddIcon(item.icon);
                                 setAddAmount(item.lowThreshold || 1);
                                 setAddUnit(item.unit || 'pz');
                                 setAddMode('custom');
                              }} className="bg-surface border-2 border-text-main rounded-[20px] p-3 flex flex-col items-center justify-center text-center hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:shadow-[6px_6px_0_0_var(--color-text-main)] transition-all neo-card">
                                 <span className="text-3xl mb-2">{item.icon}</span>
                                 <p className="font-bold text-[9px] sm:text-[10px] text-text-main leading-tight line-clamp-2">{item.name}</p>
                              </button>
                           ))}
                        </div>
                        {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                           <p className="text-center text-text-secondary font-bold text-xs py-6">No se encontraron alimentos.</p>
                        )}
                     </div>`;

const replacementStr = `<div className="max-h-[40vh] overflow-y-auto p-1 custom-scrollbar">
                        {Array.from(new Set((inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(i => i.category))).map(cat => (
                           <div key={cat} className="mb-4">
                              <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">{cat}</h4>
                              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                 {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) && i.category === cat).map(item => (
                                    <button key={item.id} onClick={() => {
                                       setAddName(item.name);
                                       setAddCat(CATEGORIES.find(c => c.toUpperCase().includes(item.category.split(',')[0].toUpperCase())) || CATEGORIES[6]);
                                       setAddIcon(item.icon);
                                       setAddAmount(item.lowThreshold || 1);
                                       setAddUnit(item.unit || 'pz');
                                       setAddMode('custom');
                                    }} className="bg-surface border-2 border-text-main rounded-[20px] p-3 flex flex-col items-center justify-center text-center hover:-translate-y-1 shadow-[4px_4px_0_0_var(--color-text-main)] hover:shadow-[6px_6px_0_0_var(--color-text-main)] transition-all neo-card">
                                       <span className="text-3xl mb-2">{item.icon}</span>
                                       <p className="font-bold text-[9px] sm:text-[10px] text-text-main leading-tight line-clamp-2">{item.name}</p>
                                    </button>
                                 ))}
                              </div>
                           </div>
                        ))}
                        {(inventory || []).filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                           <p className="text-center text-text-secondary font-bold text-xs py-6">No se encontraron alimentos.</p>
                        )}
                     </div>`;

code = code.replace(targetStr, replacementStr);

fs.writeFileSync('src/components/ShoppingView.tsx', code, 'utf-8');

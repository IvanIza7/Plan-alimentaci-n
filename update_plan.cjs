const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const target1 = `                    const hasMenuAssigned = activeMenus.some(a => a.dateId === d.id);
                    let dayClass = '';
                    if (selectedDay === i) {
                       dayClass = 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)] -translate-y-1';
                    } else if (hasMenuAssigned) {
                       dayClass = 'bg-accent-500 border-text-main text-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1';
                    } else if (d.id === todayDateId) {
                       dayClass = 'bg-background border-text-main border-dashed text-text-main hover:border-solid';
                    } else {
                       dayClass = 'bg-surface border-border-subtle text-text-secondary hover:border-text-main';
                    }`;

const repl1 = `                    const assignedMenu = activeMenus.find(a => a.dateId === d.id);
                    const hasMenuAssigned = !!assignedMenu && assignedMenu.menuId !== '';
                    let dayClass = '';
                    if (selectedDay === i) {
                       dayClass = 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)] -translate-y-1';
                    } else if (hasMenuAssigned) {
                       dayClass = 'bg-[#4ade80] border-text-main text-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1';
                    } else {
                       dayClass = 'bg-[#f87171] border-text-main text-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1';
                    }`;
code = code.replace(target1, repl1);

const target2 = `<div className="space-y-4">
                    {menus.map(m => parseMenu(m)).map((menu) => (
                       <button key={menu.id} onClick={() => assignMenu(menu.id)} className={\`w-full flex items-center justify-between p-4 rounded-[20px] border-2 transition-all \${activeForDay?.menuId === menu.id ? 'bg-primary-900 border-text-main text-surface shadow-[4px_4px_0_0_var(--color-text-main)]' : 'bg-background border-border-subtle hover:border-text-main text-text-main'}\`}>
                          <div className="text-left">
                             <h4 className="font-black text-sm uppercase tracking-widest">{menu.title}</h4>
                          </div>
                          <div className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center \${activeForDay?.menuId === menu.id ? 'border-surface bg-surface text-primary-900' : 'border-border-subtle bg-transparent'}\`}>
                             {activeForDay?.menuId === menu.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-900"></div>}
                          </div>
                       </button>
                    ))}
                 </div>`;

const repl2 = `<div className="grid grid-cols-2 gap-3">
                    <button onClick={() => assignMenu('')} className={\`w-full flex flex-col items-start justify-between p-4 rounded-[20px] border-2 transition-all \${!activeForDay?.menuId ? 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'bg-surface border-border-subtle hover:border-text-main text-text-main'}\`}>
                       <div className="text-left mb-4">
                          <h4 className="font-black text-sm uppercase tracking-widest">Sin asignar</h4>
                       </div>
                       <div className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center self-end \${!activeForDay?.menuId ? 'border-surface bg-surface text-primary-900' : 'border-border-subtle bg-transparent'}\`}>
                          {!activeForDay?.menuId && <div className="w-2.5 h-2.5 rounded-full bg-primary-900"></div>}
                       </div>
                    </button>
                    {menus.map(m => parseMenu(m)).map((menu) => (
                       <button key={menu.id} onClick={() => assignMenu(menu.id)} className={\`w-full flex flex-col items-start justify-between p-4 rounded-[20px] border-2 transition-all \${activeForDay?.menuId === menu.id ? 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'bg-surface border-border-subtle hover:border-text-main text-text-main'}\`}>
                          <div className="text-left mb-4">
                             <h4 className="font-black text-sm uppercase tracking-widest">{menu.title}</h4>
                          </div>
                          <div className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center self-end \${activeForDay?.menuId === menu.id ? 'border-surface bg-surface text-primary-900' : 'border-border-subtle bg-transparent'}\`}>
                             {activeForDay?.menuId === menu.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-900"></div>}
                          </div>
                       </button>
                    ))}
                 </div>`;
code = code.replace(target2, repl2);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');
console.log("Replaced target blocks");

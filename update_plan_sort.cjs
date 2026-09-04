const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// Add sort state and logic
const target1 = `const { menus, activeMenus, assignMenuToDate, updateMenu } = useAppData();`;
const replacement1 = `const { menus, activeMenus, assignMenuToDate, updateMenu } = useAppData();
  const [sortOrder, setSortOrder] = useState<'latest' | 'alpha'>('latest');

  const sortedMenus = [...menus.map(m => parseMenu(m))].sort((a, b) => {
    if (sortOrder === 'alpha') {
      return a.title.localeCompare(b.title);
    } else {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
      return bTime - aTime;
    }
  });`;

code = code.replace(target1, replacement1);

// Add the sort toggle UI
const target2 = `<div className="grid grid-cols-2 gap-3 sm:gap-6 mt-2 pb-10">`;
const replacement2 = `<div className="flex justify-between items-center mt-6 mb-4">
               <h3 className="font-black text-sm uppercase tracking-widest text-text-secondary">Mis Menús</h3>
               <div className="flex bg-surface border-2 border-text-main rounded-full overflow-hidden shadow-[2px_2px_0_0_var(--color-text-main)]">
                  <button 
                     onClick={() => setSortOrder('latest')} 
                     className={\`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors \${sortOrder === 'latest' ? 'bg-primary-900 text-surface' : 'hover:bg-slate-50 text-text-main'}\`}
                  >
                     Más recientes
                  </button>
                  <div className="w-0.5 bg-text-main"></div>
                  <button 
                     onClick={() => setSortOrder('alpha')} 
                     className={\`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors \${sortOrder === 'alpha' ? 'bg-primary-900 text-surface' : 'hover:bg-slate-50 text-text-main'}\`}
                  >
                     Alfabético
                  </button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-2 pb-10">`;

code = code.replace(target2, replacement2);

// Use sortedMenus in grid
const target3 = `{menus.map(m => parseMenu(m)).map((menu, i) => (`;
const replacement3 = `{sortedMenus.map((menu, i) => (`;
code = code.replace(target3, replacement3);

// Use sortedMenus in modal
const target4 = `{menus.map(m => parseMenu(m)).map((menu) => (`;
const replacement4 = `{sortedMenus.map((menu) => (`;
code = code.replace(target4, replacement4);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');
console.log("PlanView updated with sorting");

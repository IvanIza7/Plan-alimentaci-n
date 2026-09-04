const fs = require('fs');

let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

// 1. Change `let todayMenu = mockMenus[0];` to `let todayMenu: any = null;`
code = code.replace(/let todayMenu = mockMenus\[0\];/, "let todayMenu: any = null;");

// 2. Change the "No hay menú" state in Hero section
code = code.replace(
  /if \(!todayMenu \|\| !todayMenu\.meals \|\| todayMenu\.meals\.length === 0\) {[\s\S]*?return \([\s\S]*?<p className="text-\[11px\] font-bold">Asigna un menú desde el plan\.<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\);[\s\S]*?}/,
`if (!todayMenu || !todayMenu.meals || todayMenu.meals.length === 0) {
                  return (
                     <div className="bg-[#fde047] text-text-main rounded-[24px] p-4 flex gap-4 items-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)]">
                        <div className="flex-1 flex flex-col gap-2">
                           <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">No hay menú activo</p>
                             <h3 className="font-display font-black text-xl uppercase mb-1">Día Libre</h3>
                             <p className="text-[11px] font-bold">Asigna un menú desde tu plan para comenzar.</p>
                           </div>
                           <button onClick={() => onNavigate?.('plan')} className="bg-primary-900 text-surface text-xs font-black uppercase tracking-widest py-3 px-6 rounded-full border-2 border-text-main neo-btn shadow-[2px_2px_0_0_var(--color-text-main)] self-start mt-2 hover:-translate-y-1">
                              Elegir Menú
                           </button>
                        </div>
                     </div>
                  );
               }`
);

// 3. Prevent crashing at "Comidas de Hoy" and "Progress" sections if !todayMenu
code = code.replace(
  /{todayMenu\.meals\.map\(\(meal: any\) => {/g,
  "{todayMenu?.meals?.map((meal: any) => {"
);

code = code.replace(
  /<p className="text-xl font-display font-black text-white \[text-shadow:0_2px_8px_rgba\(0,0,0,0\.65\)\] tracking-tight uppercase">\{todayMenu\.title\}<\/p>/g,
  '<p className="text-xl font-display font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] tracking-tight uppercase">{todayMenu?.title || "Sin menú asignado"}</p>'
);

code = code.replace(
  /<div className="space-y-4">\s*\{todayMenu\?\.meals\?\.map/g,
  `<div className="space-y-4">\n            {!todayMenu || !todayMenu.meals || todayMenu.meals.length === 0 ? (\n              <div className="bg-surface border-2 border-dashed border-text-main rounded-[24px] p-8 text-center">\n                <p className="text-sm font-bold text-text-secondary">No hay comidas planeadas para hoy.</p>\n              </div>\n            ) : null}\n            {todayMenu?.meals?.map`
);


fs.writeFileSync('src/components/HomeView.tsx', code, 'utf-8');
console.log("HomeMenu logic updated.");

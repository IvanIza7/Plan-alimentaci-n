const fs = require('fs');

// 1. PlanView.tsx Fixes
let planViewCode = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// The main view header
// Before:
// <h1 className="text-2xl font-display font-black text-text-main tracking-tight uppercase">{menu.title}</h1>
// <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{menu.subtitle}</p>
// We want the subtitle out and title to be the main big text.
planViewCode = planViewCode.replace(/<h1 className="text-2xl font-display font-black text-text-main tracking-tight uppercase">\{menu\.title\}<\/h1>[\s\n]*<p className="text-\[10px\] font-black text-primary-500 uppercase tracking-widest">\{menu\.subtitle\}<\/p>/g, 
  '<h1 className="text-2xl font-display font-black text-text-main tracking-tight uppercase">{menu.title}</h1>');

// Card view inside the list
// Before:
// <p className="text-[8px] sm:text-[9px] font-black text-primary-700 uppercase tracking-widest mb-0.5 sm:mb-1">{menu.title}</p>
// <h3 className="text-sm sm:text-xl font-display font-black text-text-main mb-1 sm:mb-2 uppercase tracking-tight">{menu.subtitle}</h3>
planViewCode = planViewCode.replace(/<p className="text-\[8px\] sm:text-\[9px\] font-black text-primary-700 uppercase tracking-widest mb-0\.5 sm:mb-1">\{menu\.title\}<\/p>[\s\n]*<h3 className="text-sm sm:text-xl font-display font-black text-text-main mb-1 sm:mb-2 uppercase tracking-tight">\{menu\.subtitle\}<\/h3>/g, 
  '<h3 className="text-sm sm:text-xl font-display font-black text-text-main mb-1 sm:mb-2 uppercase tracking-tight">{menu.title}</h3>');

// Active day menu dropdown list
// Before:
// <h4 className="font-black text-sm uppercase tracking-widest">{menu.title}</h4>
// <p className={`text-[10px] font-bold ${activeForDay?.menuId === menu.id ? 'text-primary-300' : 'text-text-secondary'}`}>{menu.subtitle}</p>
planViewCode = planViewCode.replace(/<h4 className="font-black text-sm uppercase tracking-widest">\{menu\.title\}<\/h4>[\s\n]*<p className=\{`text-\[10px\] font-bold \$\{activeForDay\?\.menuId === menu\.id \? 'text-primary-300' : 'text-text-secondary'}`\}>\{menu\.subtitle\}<\/p>/g, 
  '<h4 className="font-black text-sm uppercase tracking-widest">{menu.title}</h4>');

fs.writeFileSync('src/components/PlanView.tsx', planViewCode, 'utf-8');

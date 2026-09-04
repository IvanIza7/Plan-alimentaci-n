const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// 1. Fix currentMenu resolution so that selecting mock menus works properly
const currentMenuStr = `  const activeForDay = activeMenus.find(a => a.dateId === selectedDateId);
  const firestoreMenu = menus.find(m => m.id === activeForDay?.menuId);
  
  const currentMenu = firestoreMenu ? {
    ...firestoreMenu,
    meals: typeof firestoreMenu.meals === 'string' ? JSON.parse(firestoreMenu.meals) : firestoreMenu.meals
  } : mockMenus[0];`;

const fixedCurrentMenuStr = `  const todayDateId = localD.toISOString().split('T')[0];
  const activeForDay = activeMenus.find(a => a.dateId === selectedDateId);
  
  let currentMenu = mockMenus[0]; // Default fallback
  if (activeForDay) {
     const firestoreMenu = menus.find(m => m.id === activeForDay.menuId);
     const mockMenu = mockMenus.find(m => m.id === activeForDay.menuId);
     
     if (firestoreMenu) {
        currentMenu = {
           ...firestoreMenu,
           meals: typeof firestoreMenu.meals === 'string' ? JSON.parse(firestoreMenu.meals) : firestoreMenu.meals
        };
     } else if (mockMenu) {
        currentMenu = mockMenu;
     }
  }`;

code = code.replace(currentMenuStr, fixedCurrentMenuStr);

// 2. Add today highlighting in the days mapping
code = code.replace(
  /className=\{\`flex flex-col items-center justify-center w-14 sm:w-16 min-w-\[56px\] py-4 rounded-\[20px\] border-2 transition-all shrink-0 snap-center mx-1 md:mx-0 \$\{selectedDay === i \? 'bg-primary-900 border-text-main text-surface neo-card shadow-\[4px_4px_0_0_var\(--color-text-main\)\] -translate-y-1' : 'bg-surface border-border-subtle text-text-secondary hover:border-text-main'\}\`\}/g,
  "className={`flex flex-col items-center justify-center w-14 sm:w-16 min-w-[56px] py-4 rounded-[20px] border-2 transition-all shrink-0 snap-center mx-1 md:mx-0 ${selectedDay === i ? 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)] -translate-y-1' : (d.dateId === todayDateId ? 'bg-accent-100 border-accent-500 text-text-main' : 'bg-surface border-border-subtle text-text-secondary hover:border-text-main')}`}"
);

// 3. Remove the FAB from 'menus' view and the Menu Selector Modal
code = code.replace(
  /\{\/\* FAB Modificar Menu \*\/\}\s*\{view === 'menus' && !selectedMenuId && \(\s*<div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-\[60\]">\s*<button onClick=\{\(\) => setShowMenuEditor\(true\)\} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-\[4px_4px_0_0_var\(--color-text-main\)\] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">\s*<Edit3 size=\{24\} \/>\s*<\/button>\s*<\/div>\s*\)\}/g,
  ""
);

code = code.replace(
  /\{\/\* FAB Editar en Selector \*\/\}\s*<div className="absolute bottom-6 right-6">\s*<button onClick=\{\(\) => \{ setShowMenuSelector\(false\); setShowMenuEditor\(true\); \}\} className="bg-primary-900 text-surface w-12 h-12 rounded-full flex items-center justify-center border-2 border-text-main shadow-\[4px_4px_0_0_var\(--color-text-main\)\] hover:-translate-y-1 transition-all">\s*<Edit3 size=\{20\} \/>\s*<\/button>\s*<\/div>/g,
  ""
);

// 4. Add the FAB to the individual selected menu view
// In if (selectedMenuId) { ... return ( <div ...> ... </div> ); }
// We want to add the FAB inside this block, and we also need a state for the menu being edited.
// Wait, when editing, we can just use the currently viewed menu!
// Let's create a state for the menu being edited.
const selectedMenuStr = `  if (selectedMenuId) {
     const menu = mockMenus.find(m => m.id === selectedMenuId) || currentMenu;
     return (
        <div className="flex flex-col pb-24 animate-in slide-in-from-bottom-8 fade-in duration-300">`;

const fixedSelectedMenuStr = `  const menuToEdit = selectedMenuId ? (mockMenus.find(m => m.id === selectedMenuId) || currentMenu) : currentMenu;
  const firestoreMenuToEdit = selectedMenuId ? menus.find(m => m.id === selectedMenuId) : menus.find(m => m.id === menuToEdit.id);

  if (selectedMenuId) {
     const menu = mockMenus.find(m => m.id === selectedMenuId) || currentMenu;
     return (
        <div className="flex flex-col pb-24 animate-in slide-in-from-bottom-8 fade-in duration-300">`;
        
code = code.replace(selectedMenuStr, fixedSelectedMenuStr);

// Inject FAB into the selectedMenuId block
code = code.replace(
  /(\s*<\/div>\s*<\/div>\s*\);\s*\}\s*return \(\s*<div)/,
  `
           {/* FAB Edit Menu inside Selected Menu View */}
           <div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-[60]">
              <button onClick={() => setShowMenuEditor(true)} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">
                 <Edit3 size={24} />
              </button>
           </div>
$1`
);

// 5. Ensure the Editor gets the right menu
code = code.replace(
  /<MenuEditorModal\s*menu=\{currentMenu\}\s*onClose=\{\(\) => setShowMenuEditor\(false\)\}\s*onSave=\{async \(updates\) => \{/g,
  `<MenuEditorModal 
              menu={menuToEdit} 
              onClose={() => setShowMenuEditor(false)} 
              onSave={async (updates) => {`
);

// We need to use `firestoreMenuToEdit` to update the menu in the DB (if it exists)
code = code.replace(
  /if \(firestoreMenu && updateMenu\) \{/g,
  `if (firestoreMenuToEdit && updateMenu) {`
);
code = code.replace(
  /await updateMenu\(firestoreMenu\.id, \{/g,
  `await updateMenu(firestoreMenuToEdit.id, {`
);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

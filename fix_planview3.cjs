const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const search = `const menuToEdit = selectedMenuId ? parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu : currentMenu;
  
  if (selectedMenuId) {
     const menu = parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu;
     const menu = menus.find(m => m.id === selectedMenuId) || currentMenu;`;

const repl = `const menuToEdit = selectedMenuId ? parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu : currentMenu;
  const firestoreMenuToEdit = selectedMenuId ? menus.find(m => m.id === selectedMenuId) : (menuToEdit ? menus.find(m => m.id === menuToEdit.id) : null);
  
  if (selectedMenuId) {
     const menu = parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu;`;

code = code.replace(search, repl);
fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

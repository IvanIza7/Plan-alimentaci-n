const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

const oldStr = `  const activeToday = activeMenus.find(a => a.dateId === todayDateId);
  const firestoreMenu = menus.find(m => m.id === activeToday?.menuId);
  const displayMenu = firestoreMenu ? {
    ...firestoreMenu,
    meals: typeof firestoreMenu.meals === 'string' ? JSON.parse(firestoreMenu.meals) : firestoreMenu.meals
  } : mockMenus[0];
  const todayMenu = displayMenu;`;

const newStr = `  const activeToday = activeMenus.find(a => a.dateId === todayDateId);
  let todayMenu = mockMenus[0];
  
  if (activeToday) {
     const firestoreMenu = menus.find(m => m.id === activeToday.menuId);
     const mockMenu = mockMenus.find(m => m.id === activeToday.menuId);
     
     if (firestoreMenu) {
        todayMenu = {
           ...firestoreMenu,
           meals: typeof firestoreMenu.meals === 'string' ? JSON.parse(firestoreMenu.meals) : firestoreMenu.meals
        };
     } else if (mockMenu) {
        todayMenu = mockMenu;
     }
  }`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('src/components/HomeView.tsx', code, 'utf-8');

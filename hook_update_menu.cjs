const fs = require('fs');
const path = './src/components/PlanView.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const { menus, activeMenus, assignMenuToDate } = useAppData();",
  "const { menus, activeMenus, assignMenuToDate, updateMenu } = useAppData();"
);

content = content.replace(
  /if \(firestoreMenu\) \{\s*\/\/[^\n]+\s*\/\/[^\n]+\s*\/\/[^\n]+\s*\}/g,
  `if (firestoreMenu && updateMenu) {
                    await updateMenu(firestoreMenu.id, {
                       title: updates.title,
                       meals: JSON.stringify(updates.meals)
                    });
                 }`
);

fs.writeFileSync(path, content, 'utf8');

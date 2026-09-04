const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

code = code.replace(/mockMenus\.map\(\(menu, i\)/g, 'menus.map(m => parseMenu(m)).map((menu, i)');
code = code.replace(/mockMenus\.map\(\(menu\)/g, 'menus.map(m => parseMenu(m)).map((menu)');

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

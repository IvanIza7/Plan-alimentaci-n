const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

code = code.replace(/mockMenus\.find/g, 'menus.find');

// Wait, let's make sure it handles undefined correctly if menu is not found.
// Actually, `const mockMenu = menus.find...`
// Let's also check if `mockMenus` is imported, maybe we don't need it.

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

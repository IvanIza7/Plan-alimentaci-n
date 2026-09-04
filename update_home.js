const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

const importHook = `import { useAppData } from '../hooks/useAppData';`;
content = content.replace("import { StatusBadge } from './StatusBadge';", `import { StatusBadge } from './StatusBadge';\n${importHook}`);

const componentStart = `export default function HomeView({ onNavigate }: { onNavigate?: (view: string) => void }) {`;
const hookCall = `  const { menus, activeMenus } = useAppData();`;

content = content.replace(componentStart, `${componentStart}\n${hookCall}\n`);

const todayMenuLogic = `  const todayDateId = new Date().toISOString().split('T')[0];
  const activeToday = activeMenus.find(a => a.dateId === todayDateId);
  const firestoreMenu = menus.find(m => m.id === activeToday?.menuId);
  
  const displayMenu = firestoreMenu ? {
    ...firestoreMenu,
    meals: typeof firestoreMenu.meals === 'string' ? JSON.parse(firestoreMenu.meals) : firestoreMenu.meals
  } : mockMenus[0];

  const todayMenu = displayMenu;`;

content = content.replace("const todayMenu = mockMenus[0];", todayMenuLogic);

fs.writeFileSync('src/components/HomeView.tsx', content);

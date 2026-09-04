const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const parseMenu = `const parseMenu = (m: any) => m ? { ...m, meals: typeof m.meals === 'string' ? JSON.parse(m.meals) : m.meals } : undefined;`;

// Let's replace the top part of PlanView body
code = code.replace(
  /export default function PlanView\(\) \{[\s\S]*?const assignMenu =/m,
  `export default function PlanView() {
  const { menus, activeMenus, assignMenuToDate, updateMenu } = useAppData();
  const [view, setView] = useState<'semana' | 'menus'>('semana');
  const currentD = new Date(); const dow = currentD.getDay(); const [selectedDay, setSelectedDay] = useState(dow === 0 ? 6 : dow - 1);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [showMenuSelector, setShowMenuSelector] = useState(false);
  const [showMenuEditor, setShowMenuEditor] = useState(false);

  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localD = new Date(d.getTime() - tzOffset);
  const currentDayOfWeek = localD.getDay(); // 0 is Sunday, 1 is Monday
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(localD.getTime() + mondayOffset * 24 * 60 * 60 * 1000);
  
  const daysNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const days = Array.from({length: 7}).map((_, i) => {
    const dayDate = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
    return {
      name: daysNames[i],
      date: dayDate.getDate(),
      fullDate: dayDate,
      id: dayDate.toISOString().split('T')[0]
    };
  });

  const parseMenu = (m: any) => m ? { ...m, meals: typeof m.meals === 'string' ? JSON.parse(m.meals) : (m.meals || []) } : undefined;

  const selectedDateId = days[selectedDay].id;
  const activeForDay = activeMenus.find(a => a.dateId === selectedDateId);
  
  let currentMenu: any = null;
  if (activeForDay) {
     currentMenu = parseMenu(menus.find(m => m.id === activeForDay.menuId));
  }

  const assignMenu =`
);

// Fix menuToEdit and selected menu rendering
code = code.replace(
  /const menuToEdit =[\s\S]*?if \(selectedMenuId\) \{/m,
  `const menuToEdit = selectedMenuId ? parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu : currentMenu;
  
  if (selectedMenuId) {
     const menu = parseMenu(menus.find(m => m.id === selectedMenuId)) || currentMenu;`
);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

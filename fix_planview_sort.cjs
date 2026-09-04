const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// add sortOrder state
code = code.replace(
  "const { menus, activeMenus, assignMenuToDate, updateMenu } = useAppData();",
  "const { menus, activeMenus, assignMenuToDate, updateMenu } = useAppData();\n  const [sortOrder, setSortOrder] = useState<'alpha' | 'latest'>('latest');"
);

// We need to sort the parsed menus
// Wait, the grid uses {menus.map(m => parseMenu(m)).map((menu, i) => (
// Let's create a sortedMenus variable.
const sortedMenusLogic = `
  const sortedMenus = [...menus.map(m => parseMenu(m))].sort((a, b) => {
    if (sortOrder === 'alpha') {
      return a.title.localeCompare(b.title);
    } else {
      // Assuming createdAt exists, or we just reverse the array since new ones are appended?
      // Wait, let's look at how parseMenu is called. Actually, we can use a.title as fallback, but if we assume newer is at the end, we can do:
      // wait, firestore docs have a createdAt field? 
      // I'll just sort by 'id' if there is no createdAt, or just reverse the array for 'latest' if we assume it's appended.
      // But actually, we have 'createdAt' on the raw menu object!
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    }
  });
`;

// wait, parseMenu(m) might not copy createdAt. Let's see how parseMenu is defined.

const fs = require('fs');

let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// 1. Destructure deleteMenu
code = code.replace(
  "const { menus, activeMenus, assignMenuToDate, updateMenu } = useAppData();",
  "const { menus, activeMenus, assignMenuToDate, updateMenu, deleteMenu } = useAppData();"
);

// 2. Update MenuEditorModal usage
code = code.replace(
  /onSave={async \(updates\) => \{[\s\S]*?setShowMenuEditor\(false\);\s*\}\}/,
  `onSave={async (updates) => {
                    if (firestoreMenuToEdit && updateMenu) {
                       await updateMenu(firestoreMenuToEdit.id, {
                          title: updates.title,
                          meals: JSON.stringify(updates.meals),
                          coverImage: updates.coverImage
                       });
                    }
                    setShowMenuEditor(false);
                 }}
                 onDelete={async () => {
                    if (firestoreMenuToEdit && deleteMenu) {
                       await deleteMenu(firestoreMenuToEdit.id);
                       setSelectedMenuId(null);
                    }
                    setShowMenuEditor(false);
                 }}`
);

// 3. Update img src
code = code.replace(
  /<img src={`https:\/\/images.unsplash.com\/photo-\${i % 2 === 0 \? '1546069901-ba9599a7e63c' : '1490645935967-10de6ba17061'}\?w=400&q=80`} alt="Menu" className="w-full h-full object-cover" \/>/g,
  `<img src={menu.coverImage || \`https://images.unsplash.com/photo-\${i % 2 === 0 ? '1546069901-ba9599a7e63c' : '1490645935967-10de6ba17061'}?w=400&q=80\`} alt="Menu" className="w-full h-full object-cover" />`
);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');
console.log("Patched PlanView.tsx");

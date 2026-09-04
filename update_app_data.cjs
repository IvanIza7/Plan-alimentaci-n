const fs = require('fs');
const path = './src/hooks/useAppData.ts';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('updateMenu')) {
  content = content.replace(
    /return \{ menus, activeMenus, loading, seedData, assignMenuToDate \};/,
    `const updateMenu = async (menuId: string, updates: Partial<Menu>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'menus', menuId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'menus');
    }
  };
  return { menus, activeMenus, loading, seedData, assignMenuToDate, updateMenu };`
  );
  fs.writeFileSync(path, content, 'utf8');
}

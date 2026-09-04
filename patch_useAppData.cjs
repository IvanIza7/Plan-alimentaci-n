const fs = require('fs');

let code = fs.readFileSync('src/hooks/useAppData.tsx', 'utf-8');

const newFunctions = `
  const addMenu = async (menuData: Omit<Menu, 'id' | 'ownerId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'menus'), {
        ...menuData,
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'menus');
    }
  };

  const deleteMenu = async (menuId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'menus', menuId));
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'menus');
    }
  };
`;

code = code.replace(
  "  const updateMenu = async (menuId: string, updates: Partial<Menu>) => {",
  newFunctions + "\n  const updateMenu = async (menuId: string, updates: Partial<Menu>) => {"
);

code = code.replace(
  "updateMenu, inventory",
  "addMenu, deleteMenu, updateMenu, inventory"
);

// Add coverImage to Menu interface
code = code.replace(
  "meals: string; // JSON string",
  "meals: string; // JSON string\n  coverImage?: string;"
);

fs.writeFileSync('src/hooks/useAppData.tsx', code, 'utf-8');
console.log("Patched useAppData.tsx");

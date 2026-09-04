const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

const replacement = `
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'ownerId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'inventory'), {
        ...item,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'inventory');
    }
  };

  const updateInventoryItem = async (itemId: string, updates: Partial<InventoryItem>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'inventory', itemId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'inventory');
    }
  };

  const deleteInventoryItem = async (itemId: string) => {
    if (!user) return;
    try {
       const { deleteDoc } = await import('firebase/firestore');
       await deleteDoc(doc(db, 'inventory', itemId));
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'inventory');
    }
  };

  const saveShoppingHistory = async (items: ShoppingItem[]) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'shoppingHistory'), {
        date: new Date().toISOString(),
        items,
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch(err) {
      console.error(err);
    }
  };

  const deleteShoppingItem = async (itemId: string) => {
    if (!user) return;
    try {
       const { deleteDoc } = await import('firebase/firestore');
       await deleteDoc(doc(db, 'shoppingList', itemId));
    } catch(err) {
      console.error(err);
    }
  };

  const addShoppingItem = async (item: Omit<ShoppingItem, 'id' | 'ownerId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'shoppingList'), {
        ...item,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'shoppingList');
    }
  };

  const updateShoppingItem = async (itemId: string, updates: Partial<ShoppingItem>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'shoppingList', itemId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'shoppingList');
    }
  };

  return { shoppingHistory, saveShoppingHistory, deleteShoppingItem, menus, activeMenus, loading, seedData, assignMenuToDate, updateMenu, inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, shoppingList, addShoppingItem, updateShoppingItem };
}
`;

code = code.substring(0, code.indexOf("const addInventoryItem = async (item: Omit<InventoryItem, 'id' |const saveShoppingHistory"));
code += replacement;

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

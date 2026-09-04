const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

const types = `
export interface ShoppingItem {
  id: string;
  name: string;
  qty: string;
  category: string;
  icon: string;
  checked: boolean;
  ownerId: string;
}
`;
code = code.replace(/export interface Menu \{/, types + '\nexport interface Menu {');

code = code.replace(
  /const \[inventory, setInventory\] = useState<InventoryItem\[\]>\(\[\]\);/,
  `const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);`
);

const onSnapshotBlock = `
    const qShopping = query(collection(db, 'shoppingList'), where('ownerId', '==', user.uid));
    const unsubscribeShopping = onSnapshot(qShopping, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShoppingItem));
      setShoppingList(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'shoppingList'));
`;
code = code.replace(
  /const unsubscribeInventory = onSnapshot\(qInventory, \(snapshot\) => \{/,
  onSnapshotBlock + `\n    const unsubscribeInventory = onSnapshot(qInventory, (snapshot) => {`
);

code = code.replace(
  /unsubscribeInventory\(\);/,
  `unsubscribeInventory();\n      unsubscribeShopping();`
);

const shoppingMutations = `
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
`;

code = code.replace(
  /return \{ menus, activeMenus, loading, seedData, assignMenuToDate, updateMenu, inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem \};/,
  shoppingMutations + '\n  return { menus, activeMenus, loading, seedData, assignMenuToDate, updateMenu, inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, shoppingList, addShoppingItem, updateShoppingItem };'
);

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

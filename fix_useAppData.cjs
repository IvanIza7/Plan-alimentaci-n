const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

// Add inventory types
const importLine = `import { mockMenus, mockInventory } from '../data';`;
code = code.replace(/import \{ mockMenus \} from '\.\.\/data';/, importLine);

const newTypes = `
export interface InventoryItem {
  id: string;
  category: string;
  name: string;
  amount: number;
  unit: string;
  lowThreshold: number;
  kcal: number;
  icon: string;
  ownerId: string;
}
`;
code = code.replace(/export interface Menu \{/, newTypes + '\nexport interface Menu {');

// Add inventory state
code = code.replace(
  /const \[activeMenus, setActiveMenus\] = useState<ActiveMenu\[\]>\(\[\]\);/,
  `const [activeMenus, setActiveMenus] = useState<ActiveMenu[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);`
);

// Add inventory onSnapshot
const onSnapshotBlock = `
    const qInventory = query(collection(db, 'inventory'), where('ownerId', '==', user.uid));
    const unsubscribeInventory = onSnapshot(qInventory, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
      setInventory(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'inventory'));
`;
code = code.replace(
  /const unsubscribeActive = onSnapshot\(qActive, \(snapshot\) => \{/,
  onSnapshotBlock + `\n    const unsubscribeActive = onSnapshot(qActive, (snapshot) => {`
);

// Unsubscribe
code = code.replace(
  /unsubscribeActive\(\);/,
  `unsubscribeActive();\n      unsubscribeInventory();`
);

// Add inventory seeding
const seedBlock = `
      const newInventory = mockInventory.map(item => {
        const ref = doc(collection(db, 'inventory'));
        batch.set(ref, {
          ...item,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return { ref, id: ref.id };
      });
`;
code = code.replace(
  /\/\/ Assign first menu to today/,
  seedBlock + '\n      // Assign first menu to today'
);

// Add inventory mutations
const inventoryMutations = `
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
`;
code = code.replace(
  /return \{ menus, activeMenus, loading, seedData, assignMenuToDate, updateMenu \};/,
  inventoryMutations + '\n  return { menus, activeMenus, loading, seedData, assignMenuToDate, updateMenu, inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem };'
);

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

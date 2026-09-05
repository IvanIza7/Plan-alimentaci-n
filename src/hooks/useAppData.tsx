import { useState, useEffect, createContext, useContext } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs, writeBatch, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';
import { mockMenus, mockInventory } from '../data'; 


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


export interface ShoppingItem {
  id: string;
  name: string;
  qty: string;
  category: string;
  icon: string;
  checked: boolean;
  ownerId: string;
}

export interface Menu {
  id: string;
  title: string;
  subtitle: string;
  meals: string; // JSON string
  coverImage?: string;
  ownerId: string;
}

export interface ActiveMenu {
  id: string;
  dateId: string; // YYYY-MM-DD
  menuId: string;
  ownerId: string;
}

export interface ShoppingHistory { id: string; date: string; items: ShoppingItem[]; ownerId: string; }

const AppDataContext = createContext<any>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {

  const { user } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeMenus, setActiveMenus] = useState<ActiveMenu[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Cleanup duplicate menus
  useEffect(() => {
    if (!user || menus.length === 0) return;
    
    // Using a timeout so it doesn't block the UI immediately upon load
    const timeout = setTimeout(async () => {
        try {
          const seenTitles = new Set();
          const duplicates = [];
          for (const m of menus) {
            if (seenTitles.has(m.title)) {
              duplicates.push(m);
            } else {
              seenTitles.add(m.title);
            }
          }
          
          for (const dup of duplicates) {
            const { deleteDoc, doc } = await import('firebase/firestore');
            await deleteDoc(doc(db, 'menus', dup.id));
          }
        } catch (e) {
          console.error("Error cleaning up duplicates", e);
        }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [user, menus]);


  useEffect(() => {
    if (!user) return;

    const qMenus = query(collection(db, 'menus'), where('ownerId', '==', user.uid));
    const unsubscribeMenus = onSnapshot(qMenus, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Menu));
      setMenus(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'menus'));

    const qActive = query(collection(db, 'activeMenus'), where('ownerId', '==', user.uid));
    
    const qInventory = query(collection(db, 'inventory'), where('ownerId', '==', user.uid));
    
    const qShopping = query(collection(db, 'shoppingList'), where('ownerId', '==', user.uid));
    const qShoppingHistory = query(collection(db, 'shoppingHistory'), where('ownerId', '==', user.uid));
    const unsubscribeShoppingHistory = onSnapshot(qShoppingHistory, (snapshot) => {
      setShoppingHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShoppingHistory)));
    });
    const unsubscribeShopping = onSnapshot(qShopping, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShoppingItem));
      setShoppingList(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'shoppingList'));

    const unsubscribeInventory = onSnapshot(qInventory, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
      // filter out duplicates by name for the UI to prevent clutter
      const uniqueData = Array.from(new Map(data.map(item => [item.name, item])).values());
      setInventory(uniqueData);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'inventory'));

    const unsubscribeActive = onSnapshot(qActive, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActiveMenu));
      setActiveMenus(data);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'activeMenus'));

    return () => {
      unsubscribeMenus();
      unsubscribeActive();
      unsubscribeInventory();
      unsubscribeShopping();
      if (typeof unsubscribeShoppingHistory !== 'undefined') unsubscribeShoppingHistory();
    };
  }, [user]);

  const seedData = async () => {
    if (loading) return;
    if (localStorage.getItem('seedData_v4_done' + user?.uid)) return;
    localStorage.setItem('seedData_v4_done' + user?.uid, 'true');
    if (!user) return;
    try {
      // Fetch directly from DB to avoid state sync issues on mount
      const { deleteDoc, doc, getDocs, query, collection, where } = await import('firebase/firestore');
      const q = query(collection(db, 'menus'), where('ownerId', '==', user.uid));
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, 'menus', d.id));
      }

      const batch = writeBatch(db);
      
      const newMenus = mockMenus.map(m => {
        const ref = doc(collection(db, 'menus'));
        batch.set(ref, {
          title: m.title,
          subtitle: m.subtitle,
          meals: JSON.stringify(m.meals),
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return { ref, id: ref.id };
      });

      
      if (inventory.length === 0) {
        mockInventory.forEach(item => {
          const ref = doc(collection(db, 'inventory'));
          batch.set(ref, {
            ...item,
            ownerId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
      }

      // Assign first menu to today
      const today = new Date().toISOString().split('T')[0];
      const activeRef = doc(collection(db, 'activeMenus'));
      batch.set(activeRef, {
        dateId: today,
        menuId: newMenus[0].id,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await batch.commit();
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'menus');
    }
  };

  const resetData = async () => {
    if (!user) return;
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      for (const m of menus) {
        await deleteDoc(doc(db, 'menus', m.id));
      }
      localStorage.removeItem('seeded_' + user.uid);
      window.location.reload();
    } catch(err) {
      console.error("Error resetting data", err);
    }
  };

  const assignMenuToDate = async (dateId: string, menuId: string) => {
    if (!user) return;
    try {
      const existing = activeMenus.find(a => a.dateId === dateId);
      if (existing) {
        await updateDoc(doc(db, 'activeMenus', existing.id), {
          menuId,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'activeMenus'), {
          dateId,
          menuId,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'activeMenus');
    }
  };


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

  const updateMenu = async (menuId: string, updates: Partial<Menu>) => {
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

  return <AppDataContext.Provider value={{ shoppingHistory, saveShoppingHistory, deleteShoppingItem, menus, activeMenus, loading, seedData, resetData, assignMenuToDate, addMenu, deleteMenu, updateMenu, inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, shoppingList, addShoppingItem, updateShoppingItem }}>{children}</AppDataContext.Provider>;
}


export function useAppData() { return useContext(AppDataContext); }

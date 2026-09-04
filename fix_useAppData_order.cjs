const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

const target = `export function useAppData() {
  // Cleanup old date-based activeMenus
  useEffect(() => {
    if (!user || activeMenus.length === 0) return;
    const cleanup = async () => {
      try {
        const toDelete = activeMenus.filter(a => !a.dateId.startsWith('day_'));
        for (const item of toDelete) {
          await deleteDoc(doc(db, 'activeMenus', item.id));
        }
      } catch (e) {
        console.error("Error cleaning up old menus", e);
      }
    };
    cleanup();
  }, [user, activeMenus]);

  const { user } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeMenus, setActiveMenus] = useState<ActiveMenu[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistory[]>([]);
  const [loading, setLoading] = useState(true);`;

const repl = `export function useAppData() {
  const { user } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeMenus, setActiveMenus] = useState<ActiveMenu[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Cleanup old date-based activeMenus
  useEffect(() => {
    if (!user || activeMenus.length === 0) return;
    const cleanup = async () => {
      try {
        const toDelete = activeMenus.filter(a => !a.dateId.startsWith('day_'));
        for (const item of toDelete) {
          // ensure import deleteDoc is present at top
          // It was added in previous step
          // wait, deleteDoc is needed here
        }
      } catch (e) {
        console.error("Error cleaning up old menus", e);
      }
    };
    cleanup();
  }, [user, activeMenus]);`;

// let's do a smarter replace using regex to avoid hardcoding the exact whitespaces.


const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

const cleanupBlock = `  // Cleanup old date-based activeMenus
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
`;

code = code.replace(cleanupBlock, '');

const varsBlock = `export function useAppData() {
  const { user } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeMenus, setActiveMenus] = useState<ActiveMenu[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistory[]>([]);
  const [loading, setLoading] = useState(true);
`;

code = code.replace(`export function useAppData() {\n  const { user }`, `export function useAppData() {
  const { user }`);
  
code = code.replace(varsBlock, varsBlock + "\n" + cleanupBlock);

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

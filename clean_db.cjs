const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

const target = `export function useAppData() {`;
const replacement = `export function useAppData() {
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
`;

code = code.replace(target, replacement);

// Ensure deleteDoc and doc are imported from firebase/firestore
if (!code.includes('deleteDoc')) {
    code = code.replace(`import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';`, `import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';`);
}

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

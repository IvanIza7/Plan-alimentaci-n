const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

const cleanupBlock = `  // Cleanup old date-based activeMenus
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

// I'll add a duplicate menus cleanup in useAppData
const newCleanupBlock = `  // Cleanup old date-based activeMenus and duplicate menus
  useEffect(() => {
    if (!user) return;
    const cleanup = async () => {
      try {
        if (activeMenus.length > 0) {
          const toDelete = activeMenus.filter(a => !a.dateId.startsWith('day_'));
          for (const item of toDelete) {
            await deleteDoc(doc(db, 'activeMenus', item.id));
          }
        }
        
        if (menus.length > 0) {
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
            await deleteDoc(doc(db, 'menus', dup.id));
          }
        }
      } catch (e) {
        console.error("Error cleaning up", e);
      }
    };
    cleanup();
  }, [user, activeMenus, menus]);`;

// Find where to replace
const target = `  // Cleanup old date-based activeMenus
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

if (code.includes(target)) {
    code = code.replace(target, newCleanupBlock);
} else {
    // try a more fuzzy search
    const regex = /\/\/ Cleanup old date-based activeMenus[\s\S]*?\}, \[user, activeMenus\]\);/m;
    code = code.replace(regex, newCleanupBlock);
}

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

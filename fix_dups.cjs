const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

const anchor = `const [loading, setLoading] = useState(true);`;

const cleanupLogic = `
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
`;

if (!code.includes('Cleanup duplicate menus')) {
    code = code.replace(anchor, anchor + "\n" + cleanupLogic);
    fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');
    console.log("Added cleanup logic");
} else {
    console.log("Logic already there");
}

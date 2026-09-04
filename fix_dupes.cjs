const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

const replacement = `
    const unsubscribeInventory = onSnapshot(qInventory, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
      
      const uniqueData = Array.from(new Map(data.map(item => [item.name, item])).values());
      const toDelete = data.filter(d => !uniqueData.find(u => u.id === d.id));
      if (toDelete.length > 0) {
         import('firebase/firestore').then(({ deleteDoc, doc }) => {
            toDelete.forEach(d => deleteDoc(doc(db, 'inventory', d.id)));
         });
      }
      
      setInventory(uniqueData);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'inventory'));
`;

code = code.replace(/const unsubscribeInventory = onSnapshot\(qInventory, \(snapshot\) => \{[^]*?\}, \(err\) => handleFirestoreError\(err, OperationType\.LIST, 'inventory'\)\);/, replacement.trim());

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

// replace the inventory subscription
const replacement = `
    const unsubscribeInventory = onSnapshot(qInventory, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
      // filter out duplicates by name for the UI to prevent clutter
      const uniqueData = Array.from(new Map(data.map(item => [item.name, item])).values());
      setInventory(uniqueData);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'inventory'));
`;
code = code.replace(/const unsubscribeInventory = onSnapshot\(qInventory, \(snapshot\) => \{[^]*?\}, \(err\) => handleFirestoreError\(err, OperationType\.LIST, 'inventory'\)\);/, replacement.trim());

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

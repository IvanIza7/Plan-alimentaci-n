const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

const replacement = `
    const unsubscribeInventory = onSnapshot(qInventory, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
      setInventory(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'inventory'));
`;

code = code.replace(/const unsubscribeInventory = onSnapshot\(qInventory, \(snapshot\) => \{[^]*?\}, \(err\) => handleFirestoreError\(err, OperationType\.LIST, 'inventory'\)\);/, replacement.trim());

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

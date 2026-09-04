const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf-8');

code = code.replace(
`export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
}, firebaseConfig.firestoreDatabaseId);`,
`export const db = initializeFirestore(app, {
}, firebaseConfig.firestoreDatabaseId);`
);

fs.writeFileSync('src/firebase.ts', code, 'utf-8');

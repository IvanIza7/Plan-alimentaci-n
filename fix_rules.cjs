const fs = require('fs');
const rules = fs.readFileSync('firestore.rules', 'utf-8');
const newRules = rules.replace(
  /match \/shoppingList\/\{itemId\} \{/,
  `match /shoppingHistory/{historyId} {
      allow read, delete: if isSignedIn() && existing().ownerId == request.auth.uid;
      allow list: if isSignedIn() && resource.data.ownerId == request.auth.uid;
      allow create, update: if isSignedIn() && incoming().ownerId == request.auth.uid;
    }
    match /shoppingList/{itemId} {`
);
fs.writeFileSync('firestore.rules', newRules);

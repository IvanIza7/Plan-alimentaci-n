const fs = require('fs');

let code = fs.readFileSync('src/components/EquivalenceSwapModal.tsx', 'utf-8');

// The line is: <div className="space-y-3">
// We want to replace it with: <div className="grid grid-cols-2 gap-3">

code = code.replace(
  /<div className="space-y-3">/g,
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">'
);

fs.writeFileSync('src/components/EquivalenceSwapModal.tsx', code, 'utf-8');
console.log("Updated to grid layout");

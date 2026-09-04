const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/opacity-70/g, "opacity-100");

fs.writeFileSync('src/App.tsx', code, 'utf-8');
console.log("Opacity removed (set to 100%)");

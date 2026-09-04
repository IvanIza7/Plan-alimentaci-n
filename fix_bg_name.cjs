const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/url\('\/af950e12-6791-46af-8277-72de36ec2bd7\.jpg'\)/g, "url('/fondo.jpg')");

fs.writeFileSync('src/App.tsx', code, 'utf-8');
console.log("Updated to fondo.jpg");

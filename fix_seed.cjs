const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

// We want to add a check in seedData: if (loading) return; 
// Let's modify seedData to just check loading. But wait, we can't easily check 'loading' state inside seedData if we don't have it in the dependency array if it was a callback, but it's defined in the hook so it has the current closure value. Actually, if we just remove seedData from HomeView and put it inside useAppData.ts after loading becomes false!

// Actually, I'll just change seedData definition:
code = code.replace(
  "const seedData = async () => {",
  "const seedData = async () => {\n    if (loading) return;\n    if (localStorage.getItem('seeded_' + user?.uid)) return;\n    localStorage.setItem('seeded_' + user?.uid, 'true');"
);

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

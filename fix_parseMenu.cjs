const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// find parseMenu declaration
const parseMenuRegex = /const parseMenu = \(m: any\) => m \? \{ \.\.\.m, meals: typeof m\.meals === 'string' \? JSON\.parse\(m\.meals\) : \(m\.meals \|\| \[\]\) \} : undefined;\s*/;
const match = code.match(parseMenuRegex);

if (match) {
  // remove it
  code = code.replace(parseMenuRegex, '');
  
  // insert before sortedMenus
  code = code.replace(
    "const sortedMenus =",
    `${match[0]}\n  const sortedMenus =`
  );
  
  fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');
  console.log("Moved parseMenu");
} else {
  console.log("parseMenu not found");
}


const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// The file has duplicated the block because I ran the script twice.
const regexDup = /const \[sortOrder, setSortOrder\] = useState<'latest' \| 'alpha'>\('latest'\);\s*const sortedMenus = \[\.\.\.menus\.map\(m => parseMenu\(m\)\)\]\.sort\(\(a, b\) => {[\s\S]*?\}\);/g;

// Find all matches
let match;
const matches = [];
while ((match = regexDup.exec(code)) !== null) {
  matches.push(match);
}

if (matches.length > 1) {
  // Remove the first one
  code = code.substring(0, matches[0].index) + code.substring(matches[0].index + matches[0][0].length);
}

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

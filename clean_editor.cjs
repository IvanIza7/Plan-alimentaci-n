const fs = require('fs');
let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

code = code.replace("ready: item.status !== 'missing'", "ready: true");

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');

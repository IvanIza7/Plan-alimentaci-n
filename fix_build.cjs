const fs = require('fs');
let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');
code = code.replace(/return `\$\{hours\.padStart\(2, '0'\)\}:\$\{minutes\}`;/g, "return hours.padStart(2, '0') + ':' + minutes;");
code = code.replace(/return `\$\{h12\.toString\(\)\.padStart\(2, '0'\)\}:\$\{minutes\} \$\{period\}`;/g, "return h12.toString().padStart(2, '0') + ':' + minutes + ' ' + period;");

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');

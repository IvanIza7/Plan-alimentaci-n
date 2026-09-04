const fs = require('fs');

let modalCode = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

modalCode = modalCode.replace("return `\\${hours.padStart(2, '0')}:\\${minutes}`;", "return hours.padStart(2, '0') + ':' + minutes;");
modalCode = modalCode.replace("return `\\${h12.toString().padStart(2, '0')}:\\${minutes} \\${period}`;", "return h12.toString().padStart(2, '0') + ':' + minutes + ' ' + period;");

fs.writeFileSync('src/components/MenuEditorModal.tsx', modalCode, 'utf-8');

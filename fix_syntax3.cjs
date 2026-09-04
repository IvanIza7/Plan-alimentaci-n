const fs = require('fs');
let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

code = code.replace(
  `          {onDelete && (
             
             {!showDeleteConfirm ? (`,
  `          {onDelete && (
             <>
             {!showDeleteConfirm ? (`
);

code = code.replace(
  `               </div>
             )}
          )}`,
  `               </div>
             )}
             </>
          )}`
);

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');
console.log("Fixed syntax 3");

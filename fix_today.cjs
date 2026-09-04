const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

code = code.replace(
  "const parseMenu",
  "const todayDateId = localD.toISOString().split('T')[0];\n\n  const parseMenu"
);

code = code.replace(
  /d\.dateId === todayDateId/g,
  "d.id === todayDateId"
);

code = code.replace(
  /\{d\.day\}/g,
  "{d.name}"
);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

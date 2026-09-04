const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// Change date generation to fixed IDs
code = code.replace(
`      id: dayDate.toISOString().split('T')[0]`,
`      id: \`day_\${i}\``
);

// Also change todayDateId to match the index
code = code.replace(
`  const todayDateId = localD.toISOString().split('T')[0];`,
`  const todayDateId = \`day_\${dow === 0 ? 6 : dow - 1}\`;`
);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

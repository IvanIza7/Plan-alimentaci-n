const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const targetStr = `  const assignMenu = (menuId: string) => {
     // Format date for the selected day based on today's date offset
     const d = new Date();
     d.setDate(d.getDate() - 3 + selectedDay); // Just as a simple date mapping
     const dateId = d.toISOString().split('T')[0];
     
     assignMenuToDate(dateId, menuId);
     setShowMenuSelector(false);
  };`;

const replaceStr = `  const assignMenu = (menuId: string) => {
     assignMenuToDate(selectedDateId, menuId);
     setShowMenuSelector(false);
  };`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

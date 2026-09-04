const fs = require('fs');

function getLocalISODate(d = new Date()) {
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10);
  return localISOTime;
}

const planPath = './src/components/PlanView.tsx';
let plan = fs.readFileSync(planPath, 'utf8');

// Replace the date logic in PlanView
plan = plan.replace(
  /const days = \[\s*\{ day: 'L', date: '31' \},[^\]]+\];/m,
  `const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localD = new Date(d.getTime() - tzOffset);
  const currentDayOfWeek = localD.getDay(); // 0 is Sunday, 1 is Monday
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(localD.getTime() + mondayOffset * 24 * 60 * 60 * 1000);
  
  const daysNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const days = Array.from({length: 7}).map((_, i) => {
    const dayDate = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
    return { day: daysNames[i], date: dayDate.getDate().toString(), dateId: dayDate.toISOString().split('T')[0] };
  });`
);
plan = plan.replace(
  /const d = new Date\(\);\s*d.setDate\(d.getDate\(\) - 3 \+ selectedDay\);\s*const selectedDateId = d.toISOString\(\).split\('T'\)\[0\];/,
  `const selectedDateId = days[selectedDay].dateId;`
);
fs.writeFileSync(planPath, plan, 'utf8');

const homePath = './src/components/HomeView.tsx';
let home = fs.readFileSync(homePath, 'utf8');
home = home.replace(
  /const todayDateId = new Date\(\).toISOString\(\).split\('T'\)\[0\];/,
  `const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localD = new Date(d.getTime() - tzOffset);
  const todayDateId = localD.toISOString().split('T')[0];`
);
fs.writeFileSync(homePath, home, 'utf8');
console.log('Dates fixed');

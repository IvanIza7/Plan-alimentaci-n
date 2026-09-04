const fs = require('fs');
let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

const helpers = `
function formatTo24h(timeStr: string) {
  if (!timeStr) return '12:00';
  if (!timeStr.includes('AM') && !timeStr.includes('PM')) return timeStr.substring(0, 5);
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  if (period === 'PM' && hours !== '12') hours = String(Number(hours) + 12);
  if (period === 'AM' && hours === '12') hours = '00';
  return \`\${hours.padStart(2, '0')}:\${minutes}\`;
}

function formatTo12h(timeStr: string) {
  if (!timeStr) return '12:00 PM';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  let [hours, minutes] = timeStr.split(':');
  const h = Number(hours);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return \`\${h12.toString().padStart(2, '0')}:\${minutes} \${period}\`;
}
`;

code = code.replace("export default function MenuEditorModal", helpers + "\nexport default function MenuEditorModal");

// Replace the new meal form time input:
const newMealFormTarget = `<input type="time" value={newMealTime} onChange={e => setNewMealTime(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />`;
const newMealFormReplacement = `<input type="time" value={formatTo24h(newMealTime)} onChange={e => setNewMealTime(formatTo12h(e.target.value))} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />`;
code = code.replace(newMealFormTarget, newMealFormReplacement);

// Replace existing meal time input:
const existingMealTarget = `<input 
                               type="time" 
                               value={meal.time.length > 5 ? meal.time.substring(0,5) : meal.time} 
                               onChange={(e) => {
                                  const newMeals = [...meals];
                                  newMeals[idx].time = e.target.value;
                                  setMeals(newMeals);
                               }}
                               className="bg-transparent text-[10px] font-black text-text-secondary uppercase tracking-widest border-b-2 border-transparent hover:border-border-subtle focus:border-text-main focus:outline-none"
                            />`;

const existingMealReplacement = `<input 
                               type="time" 
                               value={formatTo24h(meal.time)} 
                               onChange={(e) => {
                                  const newMeals = [...meals];
                                  newMeals[idx].time = formatTo12h(e.target.value);
                                  setMeals(newMeals);
                               }}
                               className="bg-transparent text-[10px] font-black text-text-secondary uppercase tracking-widest border-b-2 border-transparent hover:border-border-subtle focus:border-text-main focus:outline-none cursor-pointer"
                            />`;

code = code.replace(existingMealTarget, existingMealReplacement);

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');

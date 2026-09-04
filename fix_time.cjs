const fs = require('fs');
let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

// Change default newMealTime to 24h format for input type="time"
code = code.replace("const [newMealTime, setNewMealTime] = useState('12:00 PM');", "const [newMealTime, setNewMealTime] = useState('12:00');");

// Add time input in the new meal form
const newMealFormTarget = `<div className="grid grid-cols-2 gap-3">
                         <input type="text" placeholder="Ej: Licuado" value={newMealName} onChange={e => setNewMealName(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                         <select value={newMealType} onChange={e => setNewMealType(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all">
                            <option>DESAYUNO</option>
                            <option>COMIDA</option>
                            <option>CENA</option>
                            <option>COLACIÓN</option>
                         </select>
                      </div>`;

const newMealFormReplacement = `<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                         <input type="text" placeholder="Ej: Licuado" value={newMealName} onChange={e => setNewMealName(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                         <select value={newMealType} onChange={e => setNewMealType(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all">
                            <option>DESAYUNO</option>
                            <option>COMIDA</option>
                            <option>CENA</option>
                            <option>COLACIÓN</option>
                         </select>
                         <input type="time" value={newMealTime} onChange={e => setNewMealTime(e.target.value)} className="w-full bg-background border-2 border-text-main rounded-xl p-3 font-bold text-sm shadow-[2px_2px_0_0_var(--color-text-main)] focus:outline-none focus:translate-y-1 focus:shadow-[0_0_0_0_var(--color-text-main)] transition-all" />
                      </div>`;

code = code.replace(newMealFormTarget, newMealFormReplacement);

// Allow editing time for existing meals
const existingMealTarget = `                         <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">{meal.type} <span className="text-primary-500 mx-1">•</span> {meal.time}</p>
                         <p className="font-display font-black text-lg uppercase tracking-tight text-text-main">{meal.name}</p>`;

const existingMealReplacement = `                         <div className="flex items-center gap-2 mb-1">
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{meal.type}</p>
                            <span className="text-primary-500 text-[10px] font-black">•</span>
                            <input 
                               type="time" 
                               value={meal.time.length > 5 ? meal.time.substring(0,5) : meal.time} 
                               onChange={(e) => {
                                  const newMeals = [...meals];
                                  newMeals[idx].time = e.target.value;
                                  setMeals(newMeals);
                               }}
                               className="bg-transparent text-[10px] font-black text-text-secondary uppercase tracking-widest border-b-2 border-transparent hover:border-border-subtle focus:border-text-main focus:outline-none"
                            />
                         </div>
                         <p className="font-display font-black text-lg uppercase tracking-tight text-text-main">{meal.name}</p>`;

code = code.replace(existingMealTarget, existingMealReplacement);

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');

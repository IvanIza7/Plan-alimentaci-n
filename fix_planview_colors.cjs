const fs = require('fs');

let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const targetDaysMap = `{days.map((d, i) => (
                    <button onClick={() => setSelectedDay(i)} key={i} className={\`flex flex-col items-center justify-center w-14 sm:w-16 min-w-[56px] py-4 rounded-[20px] border-2 transition-all shrink-0 snap-center mx-1 md:mx-0 \${selectedDay === i ? 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)] -translate-y-1' : (d.id === todayDateId ? 'bg-accent-100 border-accent-500 text-text-main' : 'bg-surface border-border-subtle text-text-secondary hover:border-text-main')}\`}>
                       <span className="text-[10px] font-black uppercase tracking-widest mb-1.5">{d.name}</span>
                       <span className="text-xl font-black">{d.date}</span>
                       <div className={\`w-1.5 h-1.5 rounded-full mt-2 \${selectedDay === i ? 'bg-accent-500' : 'bg-text-secondary/30'}\`}></div>
                    </button>
                 ))}`;

const replacementDaysMap = `{days.map((d, i) => {
                    const hasMenuAssigned = activeMenus.some(a => a.dateId === d.id);
                    let dayClass = '';
                    if (selectedDay === i) {
                       dayClass = 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)] -translate-y-1';
                    } else if (hasMenuAssigned) {
                       dayClass = 'bg-accent-500 border-text-main text-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1';
                    } else if (d.id === todayDateId) {
                       dayClass = 'bg-background border-text-main border-dashed text-text-main hover:border-solid';
                    } else {
                       dayClass = 'bg-surface border-border-subtle text-text-secondary hover:border-text-main';
                    }

                    return (
                    <button onClick={() => setSelectedDay(i)} key={i} className={\`flex flex-col items-center justify-center w-14 sm:w-16 min-w-[56px] py-4 rounded-[20px] border-2 transition-all shrink-0 snap-center mx-1 md:mx-0 \${dayClass}\`}>
                       <span className="text-[10px] font-black uppercase tracking-widest mb-1.5">{d.name}</span>
                       <span className="text-xl font-black">{d.date}</span>
                       <div className={\`w-1.5 h-1.5 rounded-full mt-2 \${selectedDay === i ? 'bg-accent-500' : (hasMenuAssigned ? 'bg-text-main' : 'bg-text-secondary/30')}\`}></div>
                    </button>
                 )})}
`;

if (code.includes(targetDaysMap)) {
    code = code.replace(targetDaysMap, replacementDaysMap);
    fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');
    console.log("Successfully replaced");
} else {
    console.log("Target not found. Let's find exactly how it's formatted.");
}

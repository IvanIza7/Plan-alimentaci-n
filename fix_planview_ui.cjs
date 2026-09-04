const fs = require('fs');

let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// 1. Update colors: Red for unassigned, Green for assigned
const daysTarget = `const hasMenuAssigned = activeMenus.some(a => a.dateId === d.id && a.menuId !== '');
                    let dayClass = '';
                    if (selectedDay === i) {
                       dayClass = 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)] -translate-y-1';
                    } else if (hasMenuAssigned) {
                       dayClass = 'bg-accent-500 border-text-main text-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1';
                    } else if (d.id === todayDateId) {
                       dayClass = 'bg-background border-text-main border-dashed text-text-main hover:border-solid';
                    } else {
                       dayClass = 'bg-surface border-border-subtle text-text-secondary hover:border-text-main';
                    }`;

const daysReplacement = `const assignedMenu = activeMenus.find(a => a.dateId === d.id);
                    const hasMenuAssigned = !!assignedMenu && assignedMenu.menuId !== '';
                    let dayClass = '';
                    if (selectedDay === i) {
                       dayClass = 'bg-primary-900 border-text-main text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)] -translate-y-1';
                    } else if (hasMenuAssigned) {
                       dayClass = 'bg-green-400 border-text-main text-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1';
                    } else {
                       dayClass = 'bg-red-400 border-text-main text-text-main neo-card shadow-[4px_4px_0_0_var(--color-text-main)] hover:-translate-y-1';
                    }`;

// fallback replacement if the exact target isn't found
code = code.replace(/const hasMenuAssigned = activeMenus\.some[^}]*\}\s*else\s*\{\s*dayClass = 'bg-surface[^}]*\}\s*/g, daysReplacement);
// Wait, the regex might fail. I'll just use manual string replacement.

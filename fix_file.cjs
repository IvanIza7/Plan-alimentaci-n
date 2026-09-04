const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');
const lines = code.split('\n');

// The error is around line 113. Let's look at lines 105 to 118.
// We'll replace the problematic lines.
let newLines = [];
let i = 0;
while (i < lines.length) {
    if (lines[i].includes('  <div className="p-4 md:p-6">')) {
        newLines.push(lines[i]); i++;
        newLines.push(lines[i]); i++; // {/* Grid for Ingredients */}
        newLines.push(lines[i]); i++; // <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        newLines.push(lines[i]); i++; // {meal.ingredients?.map((ing, idx) => (
        newLines.push(lines[i]); i++; // <div key={idx} ...
        newLines.push(lines[i]); i++; // <div className="text-2xl ...
        newLines.push(lines[i]); i++; // <div className="hidden ...
        newLines.push(lines[i]); i++; // <div className="flex flex-col ...
        newLines.push(lines[i]); i++; // <p className="font-bold ...
        newLines.push(lines[i]); i++; // <p className="text-[10px] ...
        newLines.push(lines[i]); i++; // </div>
        newLines.push(lines[i]); i++; // </div>
        newLines.push(lines[i]); i++; // ))}
        newLines.push(lines[i]); i++; // </div>
        
        // Skip the extra closing divs that are causing the Unterminated RegExp issue
        while (i < lines.length && !lines[i].includes(');')) {
            i++;
        }
        
        newLines.push('                          </div>');
        newLines.push('                       </div>');
        newLines.push('                    </div>');
        newLines.push('                 );');
        i++;
    } else {
        newLines.push(lines[i]);
        i++;
    }
}

fs.writeFileSync('src/components/PlanView.tsx', newLines.join('\n'), 'utf-8');

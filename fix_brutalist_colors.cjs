const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

code = code.replace("bg-[#4ade80]", "bg-[#4ade80]"); // Ensure it's there
code = code.replace("bg-[#4ade80]", "bg-[#00E676]"); // Vibrant green
code = code.replace("bg-[#f87171]", "bg-[#FF3D00]"); // Vibrant red-orange/red

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

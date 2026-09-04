const fs = require('fs');
const path = './src/components/ProgressView.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<input type="range" min="30" max="150" step="0.1" value={newWeight || 65} onChange={e => setNewWeight(e.target.value)} className="w-full max-w-[200px] accent-primary-500" />',
  '<input type="range" min="30" max="150" step="0.1" value={newWeight || 65} onChange={e => setNewWeight(e.target.value)} className="h-40 w-8 accent-primary-500 cursor-grab active:cursor-grabbing" style={{ WebkitAppearance: "slider-vertical", writingMode: "bt-lr" }} />'
);

content = content.replace(
  '<div className="flex flex-col items-center gap-2">',
  '<div className="flex items-center gap-6">'
);

fs.writeFileSync(path, content, 'utf8');

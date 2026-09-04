const fs = require('fs');
const path = './src/components/ProgressView.tsx';
let content = fs.readFileSync(path, 'utf8');

// segmented control for adherencia tab
content = content.replace(
  /className=\{\`flex-1 py-3 rounded-full text-\[10px\] sm:text-xs font-black uppercase tracking-widest transition-all \$\{tab === 'adherencia' \? 'bg-accent-500 text-text-main neo-card shadow-\[4px_4px_0_0_var\(--color-text-main\)\]' : 'text-text-secondary hover:text-text-main'\}\`\}/,
  "className={`flex-1 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${tab === 'adherencia' ? 'bg-primary-900 text-surface neo-card shadow-[4px_4px_0_0_var(--color-text-main)]' : 'text-text-secondary hover:text-text-main'}`}"
);

// Main Stats Card
content = content.replace(
  /<div className="bg-accent-500 rounded-\[32px\] p-8 text-text-main shadow-\[8px_8px_0_0_var\(--color-text-main\)\] border-2 border-text-main flex flex-col">/,
  '<div className="bg-primary-900 rounded-[32px] p-8 text-surface shadow-[8px_8px_0_0_var(--color-text-main)] border-2 border-text-main flex flex-col">'
);
content = content.replace(
  /<p className="text-\[10px\] font-black uppercase tracking-widest text-text-secondary mb-2">Nivel de Adherencia<\/p>/,
  '<p className="text-[10px] font-black uppercase tracking-widest text-primary-300 mb-2">Nivel de Adherencia</p>'
);
content = content.replace(
  /<h2 className="text-6xl md:text-7xl font-display font-black text-text-main tracking-tighter">\{totalMeals > 0 \? adherenceScore : '--'\}<\/h2>/,
  '<h2 className="text-6xl md:text-7xl font-display font-black text-surface tracking-tighter">{totalMeals > 0 ? adherenceScore : \'--\'}</h2>'
);
content = content.replace(
  /<span className="text-2xl font-bold text-text-secondary">%<\/span>/,
  '<span className="text-2xl font-bold text-primary-300">%</span>'
);
content = content.replace(
  /<p className="text-\[9px\] font-bold uppercase tracking-widest text-text-secondary">\{adherenceScore >= 80 \? '¡Vas por muy buen camino!' : 'Sigue esforzándote, ¡tú puedes!'\}<\/p>/,
  '<p className="text-[9px] font-bold uppercase tracking-widest text-primary-300">{adherenceScore >= 80 ? \'¡Vas por muy buen camino!\' : \'Sigue esforzándote, ¡tú puedes!\'}</p>'
);

fs.writeFileSync(path, content, 'utf8');

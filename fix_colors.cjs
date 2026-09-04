const fs = require('fs');

function replaceFile(path, replacer) {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf-8');
    code = replacer(code);
    fs.writeFileSync(path, code, 'utf-8');
  }
}

// 1. HomeView.tsx
replaceFile('src/components/HomeView.tsx', code => {
  // Fecha
  code = code.replace(
    /className="text-\[10px\] font-bold text-primary-500 uppercase tracking-widest mb-1\.5"/,
    'className="text-[10px] font-black text-white drop-shadow-md uppercase tracking-widest mb-1.5"'
  );
  // Saludo
  code = code.replace(
    /className="text-3xl md:text-4xl font-display font-black text-text-main tracking-tight">Hola, Iván/,
    'className="text-3xl md:text-4xl font-display font-black text-white drop-shadow-md tracking-tight">Hola, Iván'
  );
  // Comidas de Hoy
  code = code.replace(
    /className="text-\[10px\] font-black text-text-secondary uppercase tracking-widest mb-1">Comidas de Hoy/,
    'className="text-[10px] font-black text-white drop-shadow-md uppercase tracking-widest mb-1">Comidas de Hoy'
  );
  // Menu title
  code = code.replace(
    /className="text-xl font-display font-black text-text-main tracking-tight uppercase">\{todayMenu\.title\}<\/p>/,
    'className="text-xl font-display font-black text-white drop-shadow-md tracking-tight uppercase">{todayMenu.title}</p>'
  );
  // Acciones Rapidas
  code = code.replace(
    /className="text-\[10px\] font-black text-text-secondary uppercase tracking-widest mb-4 px-2">Acciones Rápidas/,
    'className="text-[10px] font-black text-white drop-shadow-md uppercase tracking-widest mb-4 px-2">Acciones Rápidas'
  );
  return code;
});

// 2. All screens h1 (Mi plan, Progreso, Compras, etc.)
const screens = [
  'src/components/PlanView.tsx',
  'src/components/ShoppingView.tsx',
  'src/components/ProgressView.tsx',
  'src/components/InventoryView.tsx',
  'src/components/EquivalencesView.tsx',
  'src/components/ProfileView.tsx'
];

screens.forEach(s => {
  replaceFile(s, code => {
    return code.replace(
      /className="text-3xl md:text-4xl font-display font-black text-text-main tracking-tight uppercase"/g,
      'className="text-3xl md:text-4xl font-display font-black text-white drop-shadow-md tracking-tight uppercase"'
    );
  });
});

replaceFile('src/components/ProfileView.tsx', code => {
  return code.replace(
    /className="text-3xl font-display font-black text-text-main tracking-tight"/,
    'className="text-3xl font-display font-black text-white drop-shadow-md tracking-tight"'
  );
});

console.log("Colors updated");

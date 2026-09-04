const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const TAB_POSITIONS = `
const bgPositionMap: Record<string, string> = {
  'inicio': '0%',
  'plan': '25%',
  'inventario': '35%',
  'equivalencias': '35%',
  'compras': '50%',
  'progreso': '75%',
  'perfil': '100%'
};
`;

code = code.replace(
  "export default function App() {",
  TAB_POSITIONS + "\nexport default function App() {"
);

code = code.replace(
  /className="fixed inset-0 z-\[0\] bg-cover bg-center bg-fixed pointer-events-none "/g,
  `className="fixed inset-0 z-[0] bg-fixed pointer-events-none transition-all duration-1000 ease-out"`
);

// We have two places with style={{ backgroundImage: "url('/fondo.jpg')" }}
// First one is in the unauthenticated view
code = code.replace(
  `style={{ backgroundImage: "url('/fondo.jpg')" }}`,
  `style={{ backgroundImage: "url('/fondo.jpg')", backgroundSize: 'cover', backgroundPosition: '50% center' }}`
);

// Second one is in the authenticated view. Let's make sure we find it.
code = code.replace(
  `style={{ backgroundImage: "url('/fondo.jpg')" }}`,
  `style={{ 
          backgroundImage: "url('/fondo.jpg')", 
          backgroundSize: 'cover', 
          backgroundPosition: \`\${bgPositionMap[activeTab] || '0%'} center\` 
        }}`
);

fs.writeFileSync('src/App.tsx', code, 'utf-8');
console.log("Patched App.tsx for sliding background");

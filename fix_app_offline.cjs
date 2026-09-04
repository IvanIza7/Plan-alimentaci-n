const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import
code = code.replace("import { useAuth } from './AuthContext';", "import { useAuth } from './AuthContext';\nimport { useNetworkStatus } from './hooks/useNetworkStatus';\nimport { WifiOff, Wifi } from 'lucide-react';");

// Add hook
code = code.replace("const { user, loading, signIn } = useAuth();", "const { user, loading, signIn } = useAuth();\n  const isOnline = useNetworkStatus();");

// Add offline indicator before main content
const mainTarget = `<main className="flex-1 p-5 sm:p-8 lg:p-12 max-w-xl mx-auto w-full min-h-screen pb-32 md:pb-12">`;
const mainReplacement = `<main className="flex-1 p-5 sm:p-8 lg:p-12 max-w-xl mx-auto w-full min-h-screen pb-32 md:pb-12">
         {!isOnline && (
            <div className="bg-[#fde047] text-text-main p-4 rounded-[20px] mb-6 flex items-center justify-between border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] animate-in slide-in-from-top-4 fade-in">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center border-2 border-text-main">
                     <WifiOff size={18} />
                  </div>
                  <div>
                     <p className="font-black text-sm uppercase tracking-widest">Modo Sin Conexión</p>
                     <p className="text-[10px] font-bold">Tus cambios se sincronizarán al recuperar la señal.</p>
                  </div>
               </div>
            </div>
         )}`;

code = code.replace(mainTarget, mainReplacement);
fs.writeFileSync('src/App.tsx', code, 'utf-8');

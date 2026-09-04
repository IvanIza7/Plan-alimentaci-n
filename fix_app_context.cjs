const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// import AppDataProvider
code = code.replace(
  "import { useNetworkStatus } from './hooks/useNetworkStatus';",
  "import { useNetworkStatus } from './hooks/useNetworkStatus';\nimport { AppDataProvider } from './hooks/useAppData';"
);

// Wrap main return content. 
// We should wrap it inside `if (!user)` so we only provide it to authenticated app, OR we can wrap the main div.
const target = `return (
    <div className="flex flex-col min-h-screen bg-background md:pl-[300px] overflow-x-hidden relative">`;

const replacement = `return (
    <AppDataProvider>
    <div className="flex flex-col min-h-screen bg-background md:pl-[300px] overflow-x-hidden relative">`;

code = code.replace(target, replacement);

const endTarget = `    </div>
  );`;
const endReplacement = `    </div>
    </AppDataProvider>
  );`;

code = code.replace(endTarget, endReplacement);

fs.writeFileSync('src/App.tsx', code, 'utf-8');

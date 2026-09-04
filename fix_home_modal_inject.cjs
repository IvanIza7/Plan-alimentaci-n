const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

if (!code.includes('<EquivalenceSwapModal')) {
    const endTarget = `      {activeMealTracker && (`;
    const endReplacement = `      {/* Equivalences Swap Modal */}
      {swapTarget && (
         <EquivalenceSwapModal 
            ingredient={swapTarget.ingredient}
            onClose={() => setSwapTarget(null)}
            onSwap={handleSwapIngredient}
         />
      )}
      
      {activeMealTracker && (`;
    code = code.replace(endTarget, endReplacement);
    fs.writeFileSync('src/components/HomeView.tsx', code, 'utf-8');
    console.log("Modal injected");
}

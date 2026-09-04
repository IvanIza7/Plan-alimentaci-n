const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const target = `) : (
           <div className="flex justify-between items-center mt-6 mb-4">`;
const replacement = `) : (
           <>
           <div className="flex justify-between items-center mt-6 mb-4">`;

code = code.replace(target, replacement);

const endTarget = `                 </div>
              ))}
           </div>
        )}`;

const endReplacement = `                 </div>
              ))}
           </div>
           </>
        )}`;

code = code.replace(endTarget, endReplacement);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

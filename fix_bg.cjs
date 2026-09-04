const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// For the authenticated view:
const target1 = `<div className="flex flex-col min-h-screen bg-background md:pl-[300px] overflow-x-hidden">`;
const replacement1 = `<div className="flex flex-col min-h-screen bg-background md:pl-[300px] overflow-x-hidden relative">
      <div 
        className="fixed inset-0 z-[0] bg-cover bg-center bg-fixed opacity-70 pointer-events-none"
        style={{ backgroundImage: "url('/af950e12-6791-46af-8277-72de36ec2bd7.jpg')" }}
      />
      <div className="relative z-10 flex flex-col min-h-screen w-full">`;
      
code = code.replace(target1, replacement1);

// We need to close the relative z-10 div
const target2 = `</nav>
    </div>
  );`;
const replacement2 = `</nav>
      </div>
    </div>
  );`;
code = code.replace(target2, replacement2);

// For the unauthenticated view:
const unauthTarget = `<div className="min-h-screen bg-background flex items-center justify-center p-6">`;
const unauthReplacement = `<div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div 
        className="fixed inset-0 z-[0] bg-cover bg-center bg-fixed opacity-70 pointer-events-none"
        style={{ backgroundImage: "url('/af950e12-6791-46af-8277-72de36ec2bd7.jpg')" }}
      />
      <div className="relative z-10 w-full flex justify-center">`;
code = code.replace(unauthTarget, unauthReplacement);

const unauthEndTarget = `</button>
        </div>
      </div>
    );`;
const unauthEndReplacement = `</button>
        </div>
      </div>
      </div>
    );`;
code = code.replace(unauthEndTarget, unauthEndReplacement);

fs.writeFileSync('src/App.tsx', code, 'utf-8');
console.log("Background updated");

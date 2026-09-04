const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// The IIFE is:
//         </div>
//       );
//     })()}

// Let's remove the FAB from where I wrongly placed it
code = code.replace(/\s*\{\/\* FAB Edit Menu \*\/\}\s*<div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-\[60\]">\s*<button onClick=\{\(\) => setShowMenuEditor\(true\)\} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-\[4px_4px_0_0_var\(--color-text-main\)\] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">\s*<Edit3 size=\{24\} \/>\s*<\/button>\s*<\/div>\s*<\/div>\s*\);\s*\}/, `\n       </div>\n     );\n  }`);

// Now let's place it at the very end of `if (selectedMenuId) { ... }` block
// The block ends around line 133 or something with:
//              </div>
//           </div>
//        );
//     })}
//  </div>
// </div>
// );
// }

// Let's just find "return (" in the main component and the end of selectedMenuId.
// Actually, it's easier to find:
//                          </div>
//                       </div>
//                    </div>
//                 );
//              })}
//           </div>
//        </div>
//     );
//   }

code = code.replace(/(\s*<\/div>\s*<\/div>\s*\);\s*\}\s*return \(\s*<div)/, 
`
           {/* FAB Edit Menu */}
           <div className="fixed bottom-24 md:bottom-12 right-6 flex justify-end pointer-events-none z-[60]">
              <button onClick={() => setShowMenuEditor(true)} className="pointer-events-auto bg-primary-900 text-surface w-14 h-14 rounded-full font-black flex items-center justify-center border-2 border-text-main shadow-[4px_4px_0_0_var(--color-text-main)] hover:bg-primary-800 transition-all hover:-translate-y-1 z-50">
                 <Edit3 size={24} />
              </button>
           </div>
$1`);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

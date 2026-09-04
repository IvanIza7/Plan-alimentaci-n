const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// The issue is a missing div in the loop structure. 
// We will replace the entire mapping of `currentMenu.meals` to ensure it is structurally sound.

const regex = /\{currentMenu\.meals\.map\(\(meal: any\) => \{[\s\S]*?\}\)\}\s*<\/div>\s*<\/>/g;

// Instead of regex which is failing, let's inject a complete working component for PlanView using the new color logics.
// I'll grab the code up to "return (" and down from the first error. Let's just fix it.

code = code.replace(`                                </div>
                                
                             </div>
                          </div>
                       </div>
                    </div>
                 );`, `                                </div>
                          </div>
                       </div>
                 );`);
                 
code = code.replace(`                                </div>
                                   
                                </div>
                             </div>
                          </div>
                       );`, `                                </div>
                          </div>
                       </div>
                       );`);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

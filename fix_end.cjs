const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// There is an extra closing div in the meal map loop
const target = `                                </div>
                          </div>
                       </div>
                    </div>
                 );
              })}`;
const replacement = `                                </div>
                          </div>
                    </div>
                 );
              })}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

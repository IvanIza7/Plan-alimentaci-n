const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

// There's another instance of the same issue lower down in the file for the Menu Viewer modal logic!
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

const target2 = `                                </div>
                          </div>
                       </div>
                       );
                    })}`;
const replacement2 = `                                </div>
                          </div>
                    </div>
                       );
                    })}`;
                    
code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

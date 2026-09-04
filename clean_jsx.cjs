const fs = require('fs');
let code = fs.readFileSync('src/components/PlanView.tsx', 'utf-8');

const target1 = `                                </div>
                                
                             </div>
                          </div>
                       </div>
                    </div>
                 );
              })}`;

const replacement1 = `                                </div>
                          </div>
                       </div>
                    </div>
                 );
              })}`;

const target2 = `                                </div>
                                   
                                </div>
                             </div>
                          </div>
                       );
                    })}`;

const replacement2 = `                                </div>
                          </div>
                       </div>
                 );
              })}`;
              
code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/PlanView.tsx', code, 'utf-8');

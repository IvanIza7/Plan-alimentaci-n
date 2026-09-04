const fs = require('fs');
let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

code = code.replace(
  `        </div>
      </div>
    </div>
  );
}`,
  `      </div>
    </div>
  );
}`
);

fs.writeFileSync('src/components/MenuEditorModal.tsx', code, 'utf-8');
console.log("Removed extra div");

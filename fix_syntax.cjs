const fs = require('fs');
let code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

// There is an extra closing div because I replaced the top header without keeping track properly.
// Let's count divs manually.
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

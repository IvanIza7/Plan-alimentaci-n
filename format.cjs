const fs = require('fs');
const code = fs.readFileSync('src/components/MenuEditorModal.tsx', 'utf-8');

let tags = [];
let idx = 0;
while(idx < code.length) {
  const openTag = code.indexOf('<div', idx);
  const closeTag = code.indexOf('</div', idx);
  
  if(openTag !== -1 && (openTag < closeTag || closeTag === -1)) {
    tags.push({type: 'open', idx: openTag});
    idx = openTag + 4;
  } else if (closeTag !== -1) {
    tags.push({type: 'close', idx: closeTag});
    idx = closeTag + 5;
  } else {
    break;
  }
}

let depth = 0;
for(const tag of tags) {
  if (tag.type === 'open') depth++;
  else depth--;
}
console.log("Final depth:", depth);

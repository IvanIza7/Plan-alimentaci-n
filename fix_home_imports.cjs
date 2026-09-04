const fs = require('fs');
const path = './src/components/HomeView.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('ChevronDown')) {
  content = content.replace(
    "import { Bell, ArrowRight, Calendar, LayoutGrid, ShoppingCart, RefreshCcw } from 'lucide-react';",
    "import { Bell, ArrowRight, Calendar, LayoutGrid, ShoppingCart, RefreshCcw, ChevronDown } from 'lucide-react';"
  );
}

fs.writeFileSync(path, content, 'utf8');

const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');

// 1. Add createContext, useContext to react import
code = code.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState, useEffect, createContext, useContext } from 'react';"
);

// 2. Add AppDataContext at the top
code = code.replace(
  "export function useAppData() {",
  "const AppDataContext = createContext<any>(null);\n\nexport function AppDataProvider({ children }: { children: React.ReactNode }) {"
);

// 3. Return provider instead of object
code = code.replace(
  "return { shoppingHistory, saveShoppingHistory, deleteShoppingItem, menus, activeMenus, loading, seedData, assignMenuToDate, updateMenu, inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, shoppingList, addShoppingItem, updateShoppingItem };",
  "return <AppDataContext.Provider value={{ shoppingHistory, saveShoppingHistory, deleteShoppingItem, menus, activeMenus, loading, seedData, assignMenuToDate, updateMenu, inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, shoppingList, addShoppingItem, updateShoppingItem }}>{children}</AppDataContext.Provider>;"
);

// 4. Add useAppData at the end
code += "\n\nexport function useAppData() { return useContext(AppDataContext); }\n";

fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

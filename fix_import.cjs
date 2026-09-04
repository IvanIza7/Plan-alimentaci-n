const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppData.ts', 'utf-8');
code = code.replace("import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';", "import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs, writeBatch, deleteDoc } from 'firebase/firestore';");
fs.writeFileSync('src/hooks/useAppData.ts', code, 'utf-8');

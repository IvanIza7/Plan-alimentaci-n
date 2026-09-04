import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'ai-studio-planificadornutr-b7421005-3e18-4245-b0d1-bbe69388b2f0',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snap = await getDocs(collection(db, 'inventory'));
  const seen = new Set();
  let deleted = 0;
  for (const d of snap.docs) {
    const data = d.data();
    const key = `${data.ownerId}-${data.name}`;
    if (seen.has(key)) {
      await deleteDoc(d.ref);
      deleted++;
    } else {
      seen.add(key);
    }
  }
  console.log(`Deleted ${deleted} duplicate items`);
  process.exit(0);
}
run();

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';
import { TrackedItem } from '../components/ConsumptionTracker';

export interface ConsumptionLog {
  id: string;
  dateId: string;
  mealId: string; // The meal name or id
  items: string; // JSON
  ownerId: string;
  adherenceScore: number;
}

export function useConsumption(dateId: string) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ConsumptionLog[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
       collection(db, 'consumptionLogs'), 
       where('ownerId', '==', user.uid),
       where('dateId', '==', dateId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConsumptionLog)).filter(log => log.dateId === dateId);
      setLogs(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'consumptionLogs'));

    return () => unsubscribe();
  }, [user, dateId]);

  const saveConsumption = async (mealId: string, items: TrackedItem[]) => {
    if (!user) return;
    try {
      const consumedCount = items.filter(i => i.status === 'consumed').length;
      const originalCount = items.filter(i => !!i.originalItem).length;
      const score = originalCount > 0 ? Math.round((consumedCount / originalCount) * 100) : 100;

      await addDoc(collection(db, 'consumptionLogs'), {
        ownerId: user.uid,
        dateId,
        mealId,
        items: JSON.stringify(items),
        adherenceScore: score,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'consumptionLogs');
    }
  };

  return { logs, saveConsumption };
}

export function useAllConsumptionLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ConsumptionLog[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'consumptionLogs'),
      where('ownerId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConsumptionLog));
      setLogs(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'consumptionLogs'));
    return () => unsubscribe();
  }, [user]);

  return { logs };
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUnsyncedQuestions, markAsSynced } from '../lib/pouchdb';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  async function checkPending() {
    const unsynced = await getUnsyncedQuestions();
    setPendingSync(unsynced.length);
  }

  async function attemptSync() {
    try {
      const unsynced = await getUnsyncedQuestions();
      if (unsynced.length === 0) return;

      console.log(`Attempting to sync ${unsynced.length} records...`);

      // Mock push to server
      const promises = unsynced.map(doc =>
        axios.post('http://localhost:3001/api/ask', {
          text: doc.text,
          sourceLang: doc.sourceLang,
          subject: doc.subject
        })
      );

      await Promise.all(promises);

      // Mark local as synced
      await markAsSynced(unsynced);
      setPendingSync(0);
      console.log('Sync successful');
    } catch (err) {
      console.error('Background sync failed', err);
    }
  }

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      attemptSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkPending();

    // Periodic retry every 5 mins when online
    const interval = setInterval(() => {
      if (navigator.onLine) attemptSync();
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, pendingSync, attemptSync, checkPending };
}

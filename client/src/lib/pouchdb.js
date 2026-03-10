// Lightweight localStorage-based queue (replaces PouchDB for now)
// PouchDB was causing a browser compatibility crash — not needed for online demo.

const STORAGE_KEY = 'bridgeminds_questions';

const getAll = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveAll = (docs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
};

export const saveLocalQuestion = async (doc) => {
  const docs = getAll();
  const newDoc = {
    _id: `question_${Date.now()}`,
    type: 'question',
    ...doc,
    synced: false,
  };
  docs.push(newDoc);
  saveAll(docs);
  return newDoc;
};

export const getUnsyncedQuestions = async () => {
  return getAll().filter((doc) => !doc.synced);
};

export const markAsSynced = async (docs) => {
  const all = getAll();
  const syncedIds = new Set(docs.map((d) => d._id));
  const updated = all.map((d) =>
    syncedIds.has(d._id) ? { ...d, synced: true } : d
  );
  saveAll(updated);
};

export default { saveLocalQuestion, getUnsyncedQuestions, markAsSynced };

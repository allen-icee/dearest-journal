const DB_NAME = 'DearestJournalDB';
const DB_VERSION = 1;
const STORE_NAME = 'journals';

let dbInstance: IDBDatabase | null = null;

/**
 * Initializes and opens a connection to the IndexedDB database.
 * Handles database versioning and object store creation.
 * 
 * @returns {Promise<IDBDatabase>} A promise resolving to the database instance.
 */

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      
      // Handle db close from other tabs
      dbInstance.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
      };
      
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const getStore = async (mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, mode);
  return transaction.objectStore(STORE_NAME);
};

export const get = async <T>(key: string): Promise<T | undefined> => {
  const store = await getStore('readonly');
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
};

export const put = async <T>(item: T): Promise<void> => {
  const store = await getStore('readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const remove = async (key: string): Promise<void> => {
  const store = await getStore('readwrite');
  return new Promise((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAll = async <T>(): Promise<T[]> => {
  const store = await getStore('readonly');
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
};

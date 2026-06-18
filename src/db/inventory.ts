import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import type { InventoryItem } from './schema';
import { db } from '../services/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';

const DB_NAME = 'home-inventory';
const STORE_NAME = 'items';
const DB_VERSION = 1;
const COLLECTION_NAME = 'items';

let dbPromise: Promise<IDBPDatabase> | null = null;

export async function initDB(): Promise<IDBPDatabase> {
  if (dbPromise) return dbPromise;
  
  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
        store.createIndex('by-name', 'name');
        store.createIndex('by-location', 'location');
      }
    },
  });
  return dbPromise;
}

export async function closeDB(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
}

export async function getAllItems(): Promise<InventoryItem[]> {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function addItem(item: InventoryItem): Promise<void> {
  const db = await initDB();
  await db.add(STORE_NAME, item);
}

export async function updateItem(item: InventoryItem): Promise<void> {
  const db = await initDB();
  await db.put(STORE_NAME, item);
}

export async function deleteItem(id: string): Promise<void> {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}

export const syncItems = (userId: string, callback: (items: InventoryItem[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => doc.data() as InventoryItem);
    callback(items);
  });
};

export const saveItemToFirebase = async (item: InventoryItem) => {
  // Ensure userId is present in the item before saving
  if (!item.userId) {
    throw new Error('userId is required to save item');
  }
  await setDoc(doc(db, COLLECTION_NAME, item.id), {
    ...item,
    updatedAt: Date.now()
  });
};

export const deleteItemFromFirebase = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};

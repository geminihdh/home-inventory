import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import type { InventoryItem } from './schema';

const DB_NAME = 'home-inventory';
const STORE_NAME = 'items';
const DB_VERSION = 1;

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

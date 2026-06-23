import { getAllItems, initDB } from '../db/inventory';

export async function exportData(): Promise<string> {
  const items = await getAllItems();
  return JSON.stringify(items, null, 2);
}

export async function importData(jsonData: string): Promise<void> {
  const items = JSON.parse(jsonData);
  const db = await initDB();
  
  const tx = db.transaction('items', 'readwrite');
  await tx.store.clear();
  for (const item of items) {
    await tx.store.add(item);
  }
  await tx.done;
}

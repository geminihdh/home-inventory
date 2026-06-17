import { describe, it, expect, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import { deleteDB } from 'idb';
import { initDB, addItem, getAllItems, updateItem, deleteItem, closeDB } from './inventory';
import type { InventoryItem } from './schema';

describe('Inventory DB', () => {
  const testItem: InventoryItem = {
    id: '1',
    name: 'Test Item',
    image: 'data:image/png;base64,test',
    description: 'Test Description',
    location: 'Kitchen',
    purchaseDate: '2024-01-01',
    expiryDate: '2025-01-01',
    memo: 'Test Memo',
    createdAt: Date.now(),
  };

  afterEach(async () => {
    await closeDB();
    await deleteDB('home-inventory');
  });

  it('should initialize the database', async () => {
    const db = await initDB();
    expect(db.name).toBe('home-inventory');
    expect(db.objectStoreNames.contains('items')).toBe(true);
  });

  it('should add an item', async () => {
    await initDB();
    await addItem(testItem);
    const items = await getAllItems();
    expect(items).toContainEqual(testItem);
  });

  it('should get all items', async () => {
    await initDB();
    await addItem(testItem);
    const item2 = { ...testItem, id: '2', name: 'Second Item' };
    await addItem(item2);
    const items = await getAllItems();
    expect(items.length).toBe(2);
    expect(items).toContainEqual(testItem);
    expect(items).toContainEqual(item2);
  });

  it('should update an item', async () => {
    await initDB();
    await addItem(testItem);
    const updatedItem = { ...testItem, name: 'Updated Name' };
    await updateItem(updatedItem);
    const items = await getAllItems();
    expect(items.find(i => i.id === '1')?.name).toBe('Updated Name');
  });

  it('should delete an item', async () => {
    await initDB();
    await addItem(testItem);
    await deleteItem('1');
    const items = await getAllItems();
    expect(items.length).toBe(0);
  });
});

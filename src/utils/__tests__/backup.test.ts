import { exportData, importData } from '../backup';
import { getAllItems, initDB } from '../../db/inventory';
import type { InventoryItem } from '../../db/schema';
import { vi, describe, test, expect, beforeEach } from 'vitest';

vi.mock('../../db/inventory');

describe('backup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('exportData should return JSON string of items', async () => {
    const mockItems: InventoryItem[] = [{ 
      id: '1', 
      name: 'Item 1', 
      location: 'Kitchen', 
      createdAt: Date.now(), 
      image: '', 
      description: '', 
      purchaseDate: '', 
      expiryDate: '', 
      memo: '',
      updatedAt: Date.now()
    }];
    vi.mocked(getAllItems).mockResolvedValue(mockItems);

    const result = await exportData();

    expect(getAllItems).toHaveBeenCalled();
    expect(JSON.parse(result)).toEqual(mockItems);
  });

  test('importData should clear and add items to DB', async () => {
    const mockItems: InventoryItem[] = [{ 
      id: '1', 
      name: 'Item 1', 
      location: 'Kitchen', 
      createdAt: Date.now(), 
      image: '', 
      description: '', 
      purchaseDate: '', 
      expiryDate: '', 
      memo: '',
      updatedAt: Date.now()
    }];
    
    const mockDb = {
      transaction: vi.fn().mockReturnValue({
        store: {
          clear: vi.fn(),
          add: vi.fn(),
        },
        done: Promise.resolve(),
      }),
    };
    vi.mocked(initDB).mockResolvedValue(mockDb as any);

    await importData(JSON.stringify(mockItems));

    expect(mockDb.transaction).toHaveBeenCalledWith('items', 'readwrite');
  });
});

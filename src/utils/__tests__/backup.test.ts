import { exportData, importData } from '../backup';
import { getAllItems, addItem } from '../../db/inventory';
import { vi, describe, test, expect, beforeEach } from 'vitest';

vi.mock('../../db/inventory');

describe('backup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('exportData should fetch items and trigger download', async () => {
    const mockItems = [{ id: '1', name: 'Item 1', location: 'Kitchen', createdAt: new Date().toISOString() }];
    vi.mocked(getAllItems).mockResolvedValue(mockItems);

    const mockDownloadFn = vi.fn();

    await exportData(mockDownloadFn);

    expect(getAllItems).toHaveBeenCalled();
    expect(mockDownloadFn).toHaveBeenCalled();
    const [blob, name] = mockDownloadFn.mock.calls[0];
    expect(blob).toBeInstanceOf(Blob);
    expect(name).toContain('backup');
  });

  test('importData should parse JSON and add items', async () => {
    const mockItems = [{ id: '1', name: 'Item 1', location: 'Kitchen', createdAt: new Date().toISOString() }];
    const file = new File([JSON.stringify(mockItems)], 'backup.json', { type: 'application/json' });
    
    vi.mocked(addItem).mockResolvedValue(undefined as unknown as void);

    await importData(file);

    expect(addItem).toHaveBeenCalledWith(mockItems[0]);
  });
});

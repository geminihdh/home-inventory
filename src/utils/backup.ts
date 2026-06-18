import { getAllItems, addItem } from '../db/inventory';
import type { InventoryItem } from '../db/schema';

export async function exportData(
  downloadFn: (blob: Blob, name: string) => void = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
): Promise<void> {
  const items = await getAllItems();
  const blob = new Blob([JSON.stringify(items)], { type: 'application/json' });
  downloadFn(blob, `inventory-backup-${new Date().toISOString()}.json`);
}

export async function importData(file: File): Promise<void> {
  const text = await file.text();
  const items = JSON.parse(text) as InventoryItem[];
  for (const item of items) {
    // For simplicity, just attempt to add; if it fails, maybe update?
    // User request says "add items back".
    try {
      await addItem(item);
    } catch {
      console.warn('Item already exists, skipping:', item.id);
    }
  }
}

import * as FileSystem from 'expo-file-system';

export interface InventoryItem {
  id: string;
  name: string;
  image: string; // Base64 encoded string
  description: string;
  location: string;
  purchaseDate: string;
  expiryDate: string;
  memo: string;
  createdAt: number;
}

const FILE_URI = FileSystem.documentDirectory + 'inventory.json';

export async function saveInventory(data: InventoryItem[]): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(FILE_URI, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving inventory:', error);
    throw error;
  }
}

export async function loadInventory(): Promise<InventoryItem[]> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FILE_URI);
    if (!fileInfo.exists) {
      return [];
    }
    const data = await FileSystem.readAsStringAsync(FILE_URI);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading inventory:', error);
    return [];
  }
}

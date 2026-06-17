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

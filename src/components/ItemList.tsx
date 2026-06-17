import type { InventoryItem } from '../db/schema';
import { ItemCard } from './ItemCard';

interface ItemListProps {
  items: InventoryItem[];
}

export function ItemList({ items }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No items in your inventory yet.</p>
        <p>Add some items to get started!</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

import type { InventoryItem } from '../db/schema';
import { ItemCard } from './ItemCard';

interface ItemListProps {
  items: InventoryItem[];
}

export function ItemList({ items }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>항목을 찾을 수 없습니다.</p>
        <p>검색어를 확인하거나 새로운 항목을 추가해보세요!</p>
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

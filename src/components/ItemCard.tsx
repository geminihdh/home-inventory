import type { InventoryItem } from '../db/schema';

interface ItemCardProps {
  item: InventoryItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();

  return (
    <div className="item-card">
      <div className="item-image-container">
        {item.image ? (
          <img src={item.image} alt={item.name} className="item-image" />
        ) : (
          <div className="item-image-placeholder">No Image</div>
        )}
      </div>
      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-location">📍 {item.location}</p>
        {item.expiryDate && (
          <p className={`item-expiry ${isExpired ? 'expired' : ''}`}>
            📅 Expiry: {item.expiryDate}
          </p>
        )}
      </div>
    </div>
  );
}

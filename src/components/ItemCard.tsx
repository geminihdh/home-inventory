import type { InventoryItem } from '../db/schema';

interface ItemCardProps {
  item: InventoryItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const calculateDDay = (expiryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '만료됨';
    if (diffDays === 0) return 'D-Day';
    return `D-${diffDays}`;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'soon';
    return 'normal';
  };

  const status = item.expiryDate ? getExpiryStatus(item.expiryDate) : 'normal';
  const dDay = item.expiryDate ? calculateDDay(item.expiryDate) : null;

  return (
    <div className={`item-card ${status === 'expired' ? 'card-expired' : ''}`}>
      <div className="item-image-container">
        {item.image ? (
          <img src={item.image} alt={item.name} className="item-image" />
        ) : (
          <div className="item-image-placeholder">이미지 없음</div>
        )}
      </div>
      <div className="item-details">
        <div className="item-header">
          <h3 className="item-name">{item.name}</h3>
          {dDay && (
            <span className={`d-day-badge ${status}`}>
              {dDay}
            </span>
          )}
        </div>
        <p className="item-location">📍 {item.location}</p>
        {item.expiryDate && (
          <p className={`item-expiry ${status === 'expired' ? 'expired' : ''}`}>
            📅 만료일: {item.expiryDate}
          </p>
        )}
      </div>
    </div>
  );
}
